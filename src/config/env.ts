import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { configTypes } from "types/app/env.js";
import { fileURLToPath } from "url";
import { envSchema } from "../validators/env.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || "development";

function checkIfPathExists(filePath) {
  if (fs.existsSync(filePath)) {
    console.log("Env File exists:", filePath);
  } else {
    console.error("Env File does NOT exist:", filePath);
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

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

const config: configTypes = {
  SERVER_PORT: parsedEnv.data.SERVER_PORT,
  SERVER_HOST: parsedEnv.data.SERVER_HOST,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
  DB_TYPE: parsedEnv.data.DB_TYPE,
  DB_USER: parsedEnv.data.DB_USER,
  DB_SCHEMA: parsedEnv.data.DB_SCHEMA,
  DB_PASSWORD: parsedEnv.data.DB_PASSWORD,
  DB_PORT: parsedEnv.data.DB_PORT,
  DB_HOST: parsedEnv.data.DB_HOST,
};

export default config;
