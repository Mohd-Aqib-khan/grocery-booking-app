import pgDB from "../db/db.js";
import { GroceryItem } from "../model/grocery.model.js";

class GroceryService {

    db = pgDB.getDB();
    async getAllItems(): Promise<GroceryItem[]> {
        return await this.db.any(`
            select item.id, item.name, item.price,sum(stock) as stock from groceries as item
            left join inventory on item.id = inventory.grocery_id
            where item.is_active and inventory.is_active
            group by item.id`);
    }

    async addItem(item: GroceryItem): Promise<void> {
        const insertedItem = await this.db.one(
            "INSERT INTO groceries (name, price) VALUES ($1, $2) RETURNING id;",
            [item.name, item.price]
        );
        const allInventory = (item.inventories ?? []).map((inventory) => {
            return this.db.none("INSERT INTO inventory (warehouse_id, grocery_id, stock) VALUES ($1, $2, $3)", [
                inventory.warehouseId,
                insertedItem.id,
                inventory.stock
            ]);
        });
        await Promise.all(allInventory);
    }

    async updateItem(id: number, item: GroceryItem): Promise<void> {
        // Ensure the grocery item exists before updating
        if (!id) {
            throw new Error("Grocery item ID is required for updating.");
        }

        // Update the grocery item in the groceries table
        await this.db.none(
            "UPDATE groceries SET name = $1, price = $2 WHERE id = $3",
            [item.name, item.price, id]
        );

        // Handle inventory updates
        if (item.inventories && item.inventories.length > 0) {
            // Use a transaction to ensure atomic updates
            await this.db.tx(async (t) => {
                for (const inventory of item.inventories || []) {
                    // Check if inventory exists for the given grocery and warehouse
                    const existingInventory = await t.oneOrNone(
                        "SELECT id FROM inventory WHERE warehouse_id = $1 AND grocery_id = $2",
                        [inventory.warehouseId, id]
                    );

                    if (existingInventory) {
                        // Update existing inventory
                        await t.none(
                            "UPDATE inventory SET stock = $1 WHERE id = $2",
                            [inventory.stock, existingInventory.id]
                        );
                    } else {
                        // Insert new inventory record
                        await t.none(
                            "INSERT INTO inventory (warehouse_id, stock) VALUES ($1, $3)",
                            [inventory.warehouseId, inventory.stock]
                        );
                    }
                }
            });
        }
    }


    async deleteItem(id: number): Promise<void> {
        await this.db.none("UPDATE groceries SET is_active=false WHERE id=$1", [id]);
    }
}

export default new GroceryService();
