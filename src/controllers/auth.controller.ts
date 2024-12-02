import AuthService from "../services/auth.service.js";
import JwtUtil from "../utils/jwt.js";
import * as bcrypt from "bcrypt";

class AuthController {
    async signUp(req: any, res: any) {
        const { username, password, role } = req.body;
        console.log("req.body", req.body);
        if (!username || !password || !role) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            const existingUser = await AuthService.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ error: "Username already exists." });
            }

            await AuthService.registerUser(username, password, role);
            return res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error." });
        }
    }

    async login(req: any, res: any) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        try {
            const user = await AuthService.findUserByUsername(username);

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid credentials." });
            }

            const token = JwtUtil.generateToken({ id: user.id, username: user.username, role: user.role });
            return res.json({ message: "Login successful.", token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Server error." });
        }
    }
}

export default new AuthController();
