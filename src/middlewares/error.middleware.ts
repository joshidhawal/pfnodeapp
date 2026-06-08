import { Request, Response, NextFunction } from "express";
import {
  EntityNotFoundError,
  QueryFailedError,
  OptimisticLockVersionMismatchError,
} from "typeorm";

import { AppLogger } from "../services/logger.service.js";
import { AppError } from "../utils/error.util.js";
import { getHttpStatusMessage } from "../utils/httpStatuscodes.util.js";
import { sendResponseJSON } from "../utils/send-res.util.js";

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const logger = AppLogger.getChildLogger("ErrorMiddleware");
  logger.error({ err });
  let statusCode = 500;
  let message = getHttpStatusMessage(statusCode);
  let stack;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
  }

  if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  switch (true) {
    case err instanceof EntityNotFoundError:
      statusCode = 404;
      break;
    case err instanceof QueryFailedError:
      statusCode = 400;
      break;
    case err instanceof OptimisticLockVersionMismatchError:
      statusCode = 409;
      break;
  }

  const jsonBody = {
    message: message,
    ...(process.env["NODE_ENV"] !== "production" && { stack }),
  };

  sendResponseJSON(res, statusCode, jsonBody);
};

export default errorHandler;
