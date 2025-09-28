// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres", // or "mysql", "sqlite", etc.
    host: "localhost",
    port: 5432,
    username: "root",
    password: "my_password",
    database: "pfnode",
    entities: [__dirname + "/entity/*.{js,ts}"], // Path to your entity files
    synchronize: true, // Use with caution in production; consider migrations
    logging: true, // Set to true for SQL query logging
    migrations: [__dirname + "/migrations/*.{js,ts}"],
    subscribers: [],
});