import { NextFunction, Request, Response } from "express";

import { AppLogger } from "../services/logger.service.js";

export function perfLogger(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();
  const logger = AppLogger.getChildLogger("PerfLogger");
  res.on("finish", () => {
    const duration = performance.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} took ${duration.toFixed(4)}ms`
    );
  });

  next();
}
