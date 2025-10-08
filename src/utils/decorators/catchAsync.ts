// utils/decorators/catchAsync.ts
import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export function CatchAsync() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      return Promise.resolve(originalMethod.call(this, req, res, next)).catch(
        next
      );
    };

    return descriptor;
  };
}
