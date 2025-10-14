import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";
import config from "./config/env.js";
import userRoutes from "./routes/user.routes.js";
import { AppDataSource } from "./data-source.js";
const app = express();
const PORT = config.SERVER_PORT;
const HOST = config.SERVER_HOST;
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/users", userRoutes);
// Error handler
app.use(errorHandler);
// Connect to DB and start server
AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, HOST, () => {
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    });
})
    .catch((err) => {
    console.error("Failed to connect to the database:", err);
});
