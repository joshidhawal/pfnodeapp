import { Server } from "http";

import compression from "compression";
import cors from "cors";
import express from "express";

import config from "./config/env.js";
import { AppDataSource } from "./data-source.js";
import errorHandler from "./middlewares/error.middleware.js";
import { perfLogger } from "./middlewares/performanceTimer.middleware.js";
import accountRoutes from "./routes/account.routes.js";
import authRoutes from "./routes/auth.routes.js";
import budgetRoutes from "./routes/budgetplanning.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";
import { AppLogger } from "./services/logger.service.js";

const app: express.Application = express();
const PORT = config.SERVER_PORT;
const HOST = config.SERVER_HOST;
const logger = AppLogger.getChildLogger("MainApp");
let server: Server | undefined;

// Disabled since just a plain ad for express and possible security leak for the hacker
// to understand what framework is used here.
app.set("x-powered-by", false);
// To completely disable ETags: Reason -> Not useful for SPA type apps.
app.disable("etag");

// // Use simple query parser (faster than 'extended' / qs library) set only if not using nested query params else leave as is.
// app.set("query parser", "simple");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // your Vite frontend
    credentials: true,
    //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"]
  }),
);

// Body Parsers with strict size limits to prevent payload DoS attacks
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(compression());
app.use(perfLogger);
// app.use(httpLogger); // pino logging all requests

// --- Experimental Future Changes
// app.use(
//   compression({
//     threshold: 1024, // Don't compress responses under 1KB
//     filter: (req, res) => {
//       // Skip compression for specific real-time or already compressed routes
//       if (req.path.includes("/api/stream-export")) {
//         return false;
//       }
//       // Fall back to standard Express compression rules for everything else
//       return compression.filter(req, res);
//     },
//   })
// );
// --------------------------------

// --- Routes ---
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/transaction", transactionRoutes);
// app.use("/api/acgrp", acGroupRoutes);

// Error handler
app.use(errorHandler);

// Connect to DB and start server
AppDataSource.initialize()
  .then(() => {
    server = app.listen(PORT, HOST, () => {
      logger.info(
        "Server is Successfully Running, and App is listening on port " + PORT,
      );
    });
  })
  .catch((err) => {
    logger.error(`Failed to connect to the database: ${err}`);
  });

// --- Graceful Shutdown Handling ---

const handleShutdown = (signal: NodeJS.Signals) => {
  logger.info(`${signal} signal received. Starting graceful shutdown...`);

  if (server) {
    logger.info("================== Shutting Down ...... ==================");
    // 1. Stop accepting new connections and wait for existing ones to finish
    server.close(async () => {
      logger.info("HTTP server closed.");

      try {
        // 2. Close your database connection securely
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          logger.info("Database connection closed.");
        }

        logger.info("Graceful shutdown complete. Exiting.");
        process.exit(0);
      } catch (err) {
        logger.error(`Error during database disconnection: ${err}`);
        process.exit(1);
      }
    });
  } else {
    // If the server hadn't started yet, just exit
    process.exit(0);
  }

  logger.info(
    "================== App Successfully Shut Down ==================",
  );
};

// Listen for termination signals
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT")); // Handles Ctrl+C locally
