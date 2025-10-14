import z from "zod";

export const envSchema = z.object({
  SERVER_PORT: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "SERVER_PORT must be a positive number",
    }),
  SERVER_HOST: z.string().nonempty("SERVER_HOST is required"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  DB_TYPE: z.string().nonempty("DB_TYPE is required"),
  DB_USER: z.string().nonempty("DB_USER is required"),
  DB_SCHEMA: z.string().nonempty("DB_SCHEMA is required"),
  DB_PASSWORD: z.string().nonempty("DB_PASSWORD is required"),
  DB_PORT: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "DB_PORT must be a positive number",
    }),
  DB_HOST: z.string().nonempty("DB_HOST is required"),
});
