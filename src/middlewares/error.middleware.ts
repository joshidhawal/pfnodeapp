import { Request, Response, NextFunction } from "express";
import { AppLogger } from "../services/logger.service.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  EntityNotFoundError,
  QueryFailedError,
  CannotCreateEntityIdMapError,
  MissingPrimaryColumnError,
  OptimisticLockVersionMismatchError,
  TransactionAlreadyStartedError,
  TransactionNotStartedError,
  EntityMetadataNotFoundError,
  TreeRepositoryNotSupportedError,
} from "typeorm";
import { getHttpStatusMessage } from "../utils/httpStatuscodes.util.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = AppLogger.getChildLogger("ErrorMiddleware");
  logger.error({ err });
  let statusCode = err.statusCode || 500;

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

  const message = getHttpStatusMessage(statusCode);

  const jsonBody = {
    message: err.message ?? message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };

  sendResponseJSON(res, statusCode, jsonBody);
};

export default errorHandler;
