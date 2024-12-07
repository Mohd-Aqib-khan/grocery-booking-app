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
        return await this.db.any(
            `
      SELECT users.id, users.username, users.password,
      role.name as roleName, role.id as roleId FROM users
        left join role on users.role = role.id
        WHERE username = $1 and isActive
      `,
            [username]
        );
    }
}

export default new AuthService();
