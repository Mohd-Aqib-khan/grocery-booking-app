import pgDB from "../db/db.js";

class OrderService {
    db = pgDB.getDB();

    async createOrder(orderRequest: OrderRequest): Promise<void> {
        const { userId, items } = orderRequest;

        await this.db.tx(async (t) => {
            // Step 1: Insert into orders table
            const order = await t.one(
                "INSERT INTO orders (user_id, total_price, created_by) VALUES ($1, $2, $3) RETURNING id",
                [userId, 0, userId]
            );

            const orderId = order.id;
            let totalPrice = 0;

            for (const item of items) {
                // Step 2: Get available stock from inventory
                const inventoryRows = await t.any(     `
                    SELECT id, warehouse_id AS "warehouseId", stock
                    FROM inventory
                    WHERE grocery_id = $1 AND stock > 0
                    ORDER BY stock DESC
                    `,
                    [item.groceryId, item.quantity]
                );

                let remainingQuantity = item.quantity;

                if (!inventoryRows || inventoryRows.length === 0) {
                    throw new Error(
                        `Insufficient stock for grocery ID ${item.groceryId}`
                    );
                }

                for (const inventory of inventoryRows) {
                    
                    if (remainingQuantity === 0) break;

                    const deduction = Math.min(remainingQuantity, inventory.stock);
                    

                    // Step 3: Update inventory stock
                    await t.none(
                        `
                        UPDATE inventory 
                        SET stock = stock - $1 
                        WHERE id = $2
                        `,
                        [deduction, inventory.id]
                    );

                    remainingQuantity -= deduction;
                }

                if (remainingQuantity > 0) {
                    throw new Error(
                        `Insufficient stock for grocery ID ${item.groceryId}`
                    );
                }

                // Step 4: Insert into order_items table
                const pricePerUnit = await t.oneOrNone(
                    `SELECT price FROM groceries WHERE id = $1`,
                    [item.groceryId],
                    (row: { price: number; }) => row.price
                );

                if (!pricePerUnit) {
                    throw new Error(`Grocery item with ID ${item.groceryId} not found.`);
                }

                await t.none(
                    `
                    INSERT INTO order_items (order_id, grocery_id, quantity, price, created_by) 
                    VALUES ($1, $2, $3, $4, $5)
                    `,
                    [orderId, item.groceryId, item.quantity, pricePerUnit, userId]
                );

                totalPrice += pricePerUnit * item.quantity;
            }

            // Step 5: Update the total price in the orders table
            await t.none("UPDATE orders SET total_price = $1, status= done WHERE id = $2", [
                totalPrice,
                orderId,
            ]);
        });
    }
}

export default new OrderService();