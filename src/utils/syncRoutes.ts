import fs from "fs";
import { authenticateUser } from "../middleware/authentication.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadRoutes = async (app: any, routesFolder = "../routes") => {
    const routesPath = path.join(__dirname, routesFolder);
    // Read all files in the specified folder
    const files = fs.readdirSync(routesPath);
    for (const file of files) {
        const route = await import(path.join(routesPath, file)); // Dynamic import
        const fileName = file.split(".")[0];
        // Apply the route to the app
        if (route[fileName].requiresAuth) {
            app.use(route[fileName].path, authenticateUser, route[fileName].router);
        } else {
            app.use(route[fileName].path, route[fileName].router);
        }
    }
};
