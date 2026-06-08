import { Response } from "express";

import { getHttpStatusMessage } from "./httpStatuscodes.util.js";

export function sendResponseJSON<T>(
  res: Response,
  httpStatus: number = 200,
  data: T = {} as T
): Response {
  const responseBody = { message: getHttpStatusMessage(httpStatus), ...data };
  return res.status(httpStatus).json(responseBody);
}
