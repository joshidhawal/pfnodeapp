import { Logger } from "pino";

import { AppLogger } from "../services/logger.service.js";

// Optional: Custom error class
class AppError extends Error {
  statusCode: number;
  errorDetails: object;
  logLabel?: string;
  logger: Logger;
  constructor(
    message: string,
    statusCode = 500,
    errorDetails: object = { errorDescription: "An Error has occured" },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Object.setPrototypeOf(this, AppError.prototype); // Keeps instanceof working
    this.logger = AppLogger.getChildLogger("AppError");
    this.logger.error(
      {
        err: {
          message: this.message,
          stack: this.stack,
          statusCode: this.statusCode,
          errorDetails: this.errorDetails,
        },
      },
      message,
    );
  }
}
export { AppError };
