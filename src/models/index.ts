import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
import { ExtendedModelStatic } from '../sequelize-types'; // Adjust path as needed
import { fileURLToPath } from 'url';

import configJson from '../config/dbConfig.js';
const dbConfig = configJson[process.env.NODE_ENV as keyof typeof configJson || 'development'];

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const basename = path.basename(__filename);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';



const db: Record<string, any> = {}; // Correct typing

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password || '', {
    dialect: dbConfig.dialect as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql', // Cast to a valid dialect
    host: dbConfig.host,
    // Add any other Sequelize options if needed
});

// Dynamically load models using async import
const loadModels = async () => {
    const modelPromises = fs.readdirSync(__dirname)
        .filter((file) => {
            return (
                file.indexOf('.') !== 0 &&
                file !== basename &&
                file.slice(-3) === '.js' // Adjust for TypeScript files
            );
        })
        .map(async (file) => {
            try {
                const modelModule = await import(path.join(__dirname, file));
                const model = modelModule.default(sequelize, DataTypes);
                console.log("Model loaded:", model.name);
                db[model.name] = model; // Add model to db
            } catch (error) {
                console.error(`Error loading model from file ${file}:`, error);
            }
        });

    // Wait for all models to be loaded
    await Promise.all(modelPromises);

    // Set up associations after loading models
    Object.keys(db).forEach((modelName) => {
        const model = db[modelName] as ExtendedModelStatic;
        if (model.associate) {
            console.log("Setting up associations for", modelName);
            model.associate(db as Record<string, ModelStatic<any>>); // Associate models
        }
    });

    // Add sequelize instance to the db object
    db.sequelize = sequelize;

    // After models are loaded and associations are set, log the db object
    console.log("Final db object with models:", db);

    // Sync the database
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
};

loadModels().catch((error) => {
    console.error("Error loading models or setting up associations:", error);
});

export default db;