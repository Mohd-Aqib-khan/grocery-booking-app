import express from "express"; // Correct import for express
import OrderController from "../controllers/order.controller.js"; // Adjust path if needed
import { checkRole } from "../middleware/checkRole.middleware.js";

const router = express.Router(); // Create the router using express.Router()

// Route to get all grocery items - accessible by "admin" and "user"
router.post("/create", checkRole(["admin", "user"]), OrderController.createOrder);


// Export the grocery routes
export const order = {
    path: "/order",
    router,
    requiresAuth: true,
};
