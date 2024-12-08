import { Request, Response } from "express";
import OrderService from "../services/order.service.js";

class OrderController {
    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderDetails = { ...req.body, userId: req?.user?.id };
            const items = await OrderService.createOrder(orderDetails);
            res.status(201).send("Order created successfully.");
        } catch (err) {
            console.log("err", err);
            res.status(500).json({ error: "Server error." });
        }
        
    }
}

export default new OrderController();