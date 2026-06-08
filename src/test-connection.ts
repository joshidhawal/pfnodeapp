import { AppDataSource } from "./data-source.js"; // or wherever your DataSource is

async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed!", error);
  } finally {
    await AppDataSource.destroy();
  }
}

testConnection();
