import express from 'express';  // Correct import
import authController from '../controllers/auth.controller.js';

const router = express.Router();  // Create the router using express.Router()

// Sign-Up Route
router.post("/signup", authController.signUp);

// Login Route
router.post("/login", authController.login);

export const auth = {
    path: "/auth",
    router,
};
