import { Request, Response } from "express";
import GroceryService from "../services/grocery.service.js";

class AdminController {
    async getItems(req: Request, res: Response): Promise<void> {
        const items = await GroceryService.getAllItems();
        res.json(items);
    }

    async addItem(req: Request, res: Response): Promise<void> {
        const { name, price, inventories } = req.body;
        await GroceryService.addItem({
            name, price, inventories,
        });
        res.status(201).send("Item added successfully.");
    }

    async updateItem(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const updates = req.body;
        await GroceryService.updateItem(parseInt(id), updates);
        res.send("Item updated successfully.");
    }

    async deleteItem(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await GroceryService.deleteItem(parseInt(id));
        res.send("Item deleted successfully.");
    }
}

export default new AdminController();
