import bcrypt from "bcrypt";
import db from "../models/index.js"; // Import Sequelize models (assuming 'User' and 'Role' are in the models)

class AuthService {

    // Register a new user
    async registerUser(username: string, password: string, role: string): Promise<any> {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assuming 'role' corresponds to the role ID or a role name
        // Here, you should check if the role exists before proceeding with user creation
        const user = await db.User.create({
            username,
            password: hashedPassword,
            role: role, // Assuming role is roleId, adjust as necessary
        });

        return user;
    }

    // Find a user by username
    async findUserByUsername(username: string): Promise<any> {
        // Use Sequelize to find the user by username
        const user = await db.User.findOne({
            where: { username },
            include: [
                {
                    model: db.Role, // Assuming there is a Role model with association to User
                    as: 'roleDetails', // Alias for the role
                    attributes: ['name', 'id'] // Select role name and id
                }
            ]
        });


        return user;
    }
}

export default new AuthService();
