import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
    id: number;
    username: string;
    roleId: string;
    roleName: string;
    iat?: number;
    exp?: number;
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized: Token has expired" });
            }
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        // Attach the decoded token to the request object
        req['user'] = decoded as DecodedToken;
        next();
    });
};
