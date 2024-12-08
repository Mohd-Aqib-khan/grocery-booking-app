import jwt from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

class JwtUtil {
    generateToken(payload: object): string {
        console.log("payload", payload, JWT_SECRET, JWT_EXPIRES_IN);
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    verifyToken(token: string): any {
        return jwt.verify(token, JWT_SECRET);
    }
}

export default new JwtUtil();
