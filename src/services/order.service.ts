import { OrderRequest } from "../model/order.model.js";
import db from "../models/index.js"; // Assuming you have Sequelize models
import { Op } from "sequelize";

class OrderService {

    // Create an order with items
    async createOrder(orderRequest: OrderRequest): Promise<void> {
        const { userId, items } = orderRequest;

        const t = await db.sequelize.transaction();

        try {
            // Step 1: Insert into orders table
            const order = await db.Order.create(
                {
                    userId,
                    totalPrice: 0, // Initial total price is 0
                    createdBy: userId
                },
                { transaction: t }
            );

            const orderId = order.id;
            let totalPrice = 0;

            for (const item of items) {
                // Step 2: Get available stock from inventory
                const inventoryRows = await db.Inventory.findAll({
                    where: {
                        groceryId: item.groceryId,
                        stock: { [Op.gt]: 0 } // stock > 0
                    },
                    order: [['stock', 'DESC']], // Sort by stock descending
                    transaction: t
                });

                let remainingQuantity = item.quantity;

                if (inventoryRows.length === 0) {
                    throw new Error(`Insufficient stock for grocery ID ${item.groceryId}`);
                }

                for (const inventory of inventoryRows) {
                    if (remainingQuantity === 0) break;

                    const deduction = Math.min(remainingQuantity, inventory.stock);

                    // Step 3: Update inventory stock
                    await inventory.update({ stock: inventory.stock - deduction }, { transaction: t });

                    remainingQuantity -= deduction;
                }

                if (remainingQuantity > 0) {
                    throw new Error(`Insufficient stock for grocery ID ${item.groceryId}`);
                }

                // Step 4: Insert into order_items table
                const groceryItem = await db.Grocery.findByPk(item.groceryId, { transaction: t });

                if (!groceryItem) {
                    throw new Error(`Grocery item with ID ${item.groceryId} not found.`);
                }

                await db.OrderItem.create(
                    {
                        orderId: orderId,
                        groceryId: item.groceryId,
                        quantity: item.quantity,
                        price: groceryItem.price,
                        createdBy: userId
                    },
                    { transaction: t }
                );

                totalPrice += groceryItem.price * item.quantity;
            }

            // Step 5: Update the total price in the orders table
            await order.update(
                { totalPrice, status: 'Done' },
                { transaction: t }
            );

            // Commit the transaction
            await t.commit();
        } catch (error) {
            // Rollback the transaction if any error occurs
            await t.rollback();
            throw error;
        }
    }
}

export default new OrderService();
