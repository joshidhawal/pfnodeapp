// src/data-source.ts
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";

// Define __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres", // or "mysql", "sqlite", etc.
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "my_password",
  database: "pfnode",
  entities: [path.resolve(__dirname, "entity", "*.{js,ts}")], // Path to your entity files
  synchronize: false, // Use with caution in production; consider migrations
  logging: true, // Set to true for SQL query logging
  migrations: [__dirname + "/migrations/*.{js,ts}"],
  subscribers: [],
});
