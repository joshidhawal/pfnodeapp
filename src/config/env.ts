import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || "development";

function checkIfPathExists(filePath) {
  if (fs.existsSync(filePath)) {
    console.log("✅ File exists:", filePath);
  } else {
    console.error("❌ File does NOT exist:", filePath);
  }
}

switch (env) {
  case "production":
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
    checkIfPathExists(path.resolve(__dirname, "../../.env"));
    break;
  case "development":
    dotenv.config({ path: path.resolve(__dirname, "../../.env.development") });
    checkIfPathExists(path.resolve(__dirname, "../../.env.development"));
    break;
  case "staging":
    dotenv.config({ path: path.resolve(__dirname, "../../.env.staging") });
    checkIfPathExists(path.resolve(__dirname, "../../.env.staging"));
    break;
  default:
    console.error("No matching env file found");
    break;
}

// testing the loading
// console.log(process.env);

export const config = { port: process.env.PORT, envtype: process.env.ENVTYPE };
