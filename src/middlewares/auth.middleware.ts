import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";
import { AppLogger } from "../services/logger.service.js";
import { AppError } from "../utils/error.util.js";

const authService = new AuthService();
const logger = AppLogger.getChildLogger("AuthMiddleware");

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.error("Missing or invalid Authorization header");
    throw new AppError("Missing or invalid Authorization header", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw Error("Invalid User Token");
  const decoded = authService.verifyToken(token);
  const userDetails = await authService.getUserSec(decoded["userId"]);
  req.user = {
    userId: userDetails["userId"],
    isAdmin: userDetails["isAdmin"],
    ...userDetails["user"],
  };
  next();
};
