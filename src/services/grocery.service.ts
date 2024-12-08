
import { GroceryItem, Inventory } from "../model/grocery.model.js"; // Sequelize Model// Sequelize Model
import db from "../models/index.js"; // Assuming the models are exported from a central location

class GroceryService {

    // Get all grocery items with their inventory count
    async getAllItems(): Promise<GroceryItem[]> {
        return await db.Grocery.findAll({
            attributes: [
                'id',
                'name',
                'price',
                [db.sequelize.fn('sum', db.sequelize.col('inventories.stock')), 'stock']
            ],
            include: [
                {
                    model: db.Inventory,
                    as: 'inventories',
                    required: false,
                    where: { isActive: true },
                    attributes: []
                }
            ],
            group: ['Grocery.id'], // Ensure to group by the item id
            where: { isActive: true }, // Only active grocery items
        });
    }

    // Add a new grocery item and associated inventories
    async addItem(item: GroceryItem, userId: number): Promise<void> {
        const grocery = await db.Grocery.create({
            name: item.name,
            price: item.price,
            createdBy: userId
        });

        // Handle inventory insertion
        if (item.inventories && item.inventories.length > 0) {
            const inventoryData = item.inventories.map((inventory: Inventory) => ({
                warehouseId: inventory.warehouseId,
                groceryId: grocery.id,
                stock: inventory.stock
            }));

            // Bulk insert inventories associated with the grocery item
            await db.Inventory.bulkCreate(inventoryData);
        }
    }

    // Update an existing grocery item and its inventories
    async updateItem(id: number, item: GroceryItem, userId: number): Promise<void> {
        // Check if the grocery item exists
        const groceryItem = await db.Grocery.findByPk(id);
        if (!groceryItem) {
            throw new Error("Grocery item not found");
        }

        // Update the grocery item
        await groceryItem.update({
            name: item.name,
            price: item.price,
            updatedBy: userId
        });

        // Use a transaction for updating inventories
        if (item.inventories && item.inventories.length > 0) {
            const t = await db.sequelize.transaction();

            try {
                for (const inventory of item.inventories) {
                    const existingInventory = await db.Inventory.findOne({
                        where: {
                            id: inventory.id
                        },
                        transaction: t
                    });

                    if (existingInventory) {
                        // Update the existing inventory
                        await existingInventory.update({ stock: inventory.stock }, { transaction: t });
                    } else {
                        // Insert a new inventory record if it doesn't exist
                        await db.Inventory.create({
                            warehouseId: inventory.warehouseId,
                            groceryId: id,
                            stock: inventory.stock
                        }, { transaction: t });
                    }
                }

                // Commit transaction
                await t.commit();
            } catch (error) {
                await t.rollback();
                throw error;
            }
        }
    }

    // Deactivate a grocery item (soft delete)
    async deleteItem(id: number, userId: number): Promise<void> {
        const groceryItem = await db.Grocery.findByPk(id);
        if (!groceryItem) {
            throw new Error("Grocery item not found");
        }

        await groceryItem.update({ isActive: false, updatedBy: userId });
    }
}

export default new GroceryService();
