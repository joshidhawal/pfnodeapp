import type { StringValue } from "ms";
import { z } from "zod";

export const envSchema = z.object({
  SERVER_PORT: z.coerce.number().positive(),
  SERVER_HOST: z.string().min(1),

  JWT_SECRET: z.string().min(10),

  DB_TYPE: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_SCHEMA: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_PORT: z.coerce.number().positive(),
  DB_HOST: z.string().min(1),

  LOG_LEVEL: z.string().optional(),
  SESSION_TIMEOUT: z.coerce.number().positive().optional(),
  API_TIMEOUT: z.coerce.number().positive().optional(),

  JWT_EXPIRES_IN: z
    .union([z.coerce.number(), z.string()])
    .default("1h")
    .transform((v) => v as StringValue | number),

  REFRESH_JWT_EXPIRES_IN: z
    .union([z.coerce.number(), z.string()])
    .default("1h")
    .transform((v) => v as StringValue | number),
});
