import { Response } from "express";

export function sendResponseJSON<T>(
  res: Response,
  httpStatus: number = 200,
  data: T = {} as T,
  message?: string
): Response {
  const responseBody = message ? { message, data } : data;
  return res.status(httpStatus).json(responseBody);
}
