// src/logger/httpLogger.ts
import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import { AppLogger } from "services/logger.service.js";

const logger = AppLogger.getChildLogger("LoggerMiddleWare");
export const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
  //   autoLogging: {
  //     ignore: (req) => req.url === "/health",`
  //   },
  customReceivedMessage: (req) =>
    `Incoming Request ${req.method} from ${req.url}`,
  customSuccessMessage: (res) =>
    `Status : ${res.statusCode}, Message: ${res.statusMessage}`,
  customErrorMessage: (error, res) => {
    if (error instanceof Error) {
      return `Status : ${res.statusCode}, Message: ${error.message}`;
    }
    return `Status : ${res.statusCode}, Message: Unknown error`;
  },
});
