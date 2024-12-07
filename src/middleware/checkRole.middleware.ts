import { Request, Response, NextFunction } from "express";

// Middleware to check for roles
export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user; // Assuming `req.user` is populated by your authentication middleware
        if (!user || !allowedRoles.includes(user.roleName)) {
            res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            return;
        }
        // If the role is valid, proceed to the next middleware/route handler
        next();
    };
};
