import { Request, Response } from "express";
import GroceryService from "../services/grocery.service.js";

class AdminController {
    async getItems(req: Request, res: Response): Promise<void> {
        const items = await GroceryService.getAllItems();
        res.json(items);
    }

    async addItem(req: Request, res: Response): Promise<void> {
        try {
            const { name, price, inventories } = req.body;
            await GroceryService.addItem({
                name, price, inventories,
            }, req?.user?.id || 0);
            res.status(201).send("Item added successfully.");
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ error: "Server error." });
        }

    }

    async updateItem(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;
            await GroceryService.updateItem(parseInt(id), updates, req?.user?.id || 0);
            res.send("Item updated successfully.");
        } catch (err) {
            console.log("err", err);
            res.status(500).json({ error: "Server error." });
        }
        
    }

    async deleteItem(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await GroceryService.deleteItem(parseInt(id), req.user?.id || 0);
        res.send("Item deleted successfully.");
    }
}

export default new AdminController();
