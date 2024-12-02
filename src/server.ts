import express from "express";
import bodyParser from "body-parser";
import pgDB from "./db/db.js";
import { loadRoutes } from "./utils/syncRoutes.js";
// import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(bodyParser.json());

pgDB.connect().then(() => {
    console.log("db Connected Successfully");
});

loadRoutes(app)

// Admin Routes
// app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
