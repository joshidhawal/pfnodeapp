import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import { Config } from "types/app/types.js";

import { AppLogger } from "../services/logger.service.js";
import { envSchema } from "../validators/env.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env["NODE_ENV"] || "development";
const logger = AppLogger.getChildLogger("ENV");

function checkIfPathExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    logger.info(`Env File exists: ${filePath}`);
  } else {
    logger.error(`Env File does NOT exist: ${filePath}`);
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
    logger.error("No matching env file found");
    break;
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(
    `Invalid environment variables: ${JSON.stringify(parsedEnv.error.format())}`,
  );
  process.exit(1);
}

export const config: Config = parsedEnv.data;
export default config;
