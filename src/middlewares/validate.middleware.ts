import { ZodType } from "zod";

import { AppError } from "../utils/error.util.js";

export function validateRequest<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const validationErrors = result.error.issues.map((err) => {
      const path = err.path.join("."); // Cleaner path string
      return `${path} : ${err.message}`;
    });
    throw new AppError("Validation Failure", 400, validationErrors); // 400 Invalid Request
  }
  return result.data;
}
