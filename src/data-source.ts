// src/data-source.ts
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";

// Define __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connectionLimit: 5, // Custom pool size
export const AppDataSource = new DataSource({
  type: "postgres", // or "mysql", "sqlite", etc.
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "my_password",
  database: "pfnode",
  entities: [path.resolve(__dirname, "model", "*.{js,ts}")], // Path to your entity files
  synchronize: true, // Use with caution in production; consider migrations
  logging: true, // Set to true for SQL query logging
  // logging: process.env.NODE_ENV == "development" ? true : false, // Set to true for SQL query logging
  migrations: [__dirname + "/migrations/*.{js,ts}"],
  subscribers: [],
  maxQueryExecutionTime: 30000,
  extra: {
    max: 10, // Maximum number of connections in the pool
    min: 2, //Minimum number of connections in the pool
    connectionTimeoutMillis: 5000, // How long a client should wait for an available connection (in milliseconds)
    idleTimeoutMillis: 30000, // How long a connection can be idle before it's closed (in milliseconds)
  },
});
