import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { loadRoutes } from "./utils/syncRoutes.js";


const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log('Server running on http://localhost:3000');
    try {
        await loadRoutes(app);
    } catch (error) {
        console.error('Unable to connect server', error);
    }
});