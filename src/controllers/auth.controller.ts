import AuthService from "../services/auth.service.js";
import JwtUtil from "../utils/jwt.js";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

class AuthController {
    async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            res.status(400).json({ error: "All fields are required." });
            return;
        }

        try {
            const existingUser = await AuthService.findUserByUsername(username);
            if (existingUser[0]) {
                res.status(400).json({ error: "Username already exists." });
                return;
            }

            await AuthService.registerUser(username, password, role);
            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            res.status(500).json({ error: "Server error." });
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: "Username and password are required." });
            return;
        }

        try {
            const user = await AuthService.findUserByUsername(username);

            if (!user) {
                res.status(401).json({ error: "Invalid credentials." });
                return;
            }
            const isPasswordValid = await bcrypt.compare(password, user[0].password);
            if (!isPasswordValid) {
                res.status(401).json({ error: "Invalid credentials." });
                return
            }

            const token = JwtUtil.generateToken({ id: user[0].id, username: user[0].username, roleName: user[0].rolename, roleId: user[0].roleid });
            res.json({ message: "Login successful.", token: `Bearer ${token}` });
        } catch (error) {
            res.status(500).json({ error: "Server error." });
        }
    }
}

export default new AuthController();
