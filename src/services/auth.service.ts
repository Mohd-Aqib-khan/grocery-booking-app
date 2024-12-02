import pgDB from "../db/db.js";
import bcrypt from "bcrypt";
class AuthService {

    db = pgDB.getDB();
    async registerUser(username: string, password: string, role: string): Promise<any> {
        const hashedPassword = await bcrypt.hash(password, 10);


        return this.db.none(
            `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      `,
            [username, hashedPassword, role]
        );
    }

    async findUserByUsername(username: string): Promise<any> {
        return await this.db.none(
            `
      SELECT * FROM users WHERE username = $1
      `,
            [username]
        );
    }
}

export default new AuthService();
