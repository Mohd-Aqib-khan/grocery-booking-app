import express from "express"; // Correct import for express
import groceryController from "../controllers/grocery.controller.js"; // Adjust path if needed
import { checkRole } from "../middleware/checkRole.middleware.js";

const router = express.Router(); // Create the router using express.Router()

// Route to get all grocery items - accessible by "admin" and "user"
router.get("/list", checkRole(["admin", "user"]), groceryController.getItems);

// Route to add a new grocery item - accessible by "admin" only
router.post("/add", checkRole(["admin"]), groceryController.addItem);

// Route to update an existing grocery item by ID - accessible by "admin" only
router.put("/:id", checkRole(["admin"]), groceryController.updateItem);

// Route to delete a grocery item by ID - accessible by "admin" and "user"
router.delete("/:id", checkRole(["admin", "user"]), groceryController.deleteItem);

// Export the grocery routes
export const grocery = {
    path: "/groceries",
    router,
    requiresAuth: true,
};
