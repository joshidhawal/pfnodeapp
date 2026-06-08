import cors from "cors";
import express from "express";
import config from "./config/env.js";
import { AppDataSource } from "./data-source.js";
import errorHandler from "./middlewares/error.middleware.js";
import { perfLogger } from "./middlewares/performanceTimer.middleware.js";
import accountRoutes from "./routes/account.routes.js";
import authRoutes from "./routes/auth.routes.js";
import budgetRoutes from "./routes/budgetplanning.routes.js";
import userRoutes from "./routes/user.routes.js";
import { AppLogger } from "./services/logger.service.js";
const app = express();
const PORT = config.SERVER_PORT;
const HOST = config.SERVER_HOST;
const logger = AppLogger.getChildLogger("MainApp");
// app.use(cors());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // your Vite frontend
    credentials: true,
    //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(perfLogger);
// app.use(httpLogger); // pino logging all requests
// Routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
// Error handler
app.use(errorHandler);
// Connect to DB and start server
AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, HOST, () => {
        logger.info("Server is Successfully Running, and App is listening on port " + PORT);
    });
})
    .catch((err) => {
    logger.error(`Failed to connect to the database: ${err}`);
});
