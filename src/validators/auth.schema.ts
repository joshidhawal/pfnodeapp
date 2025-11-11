import z from "zod";

export const signupSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
  password: z.string().nonempty("Password is required"),
});

export const getUserAuthSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

export const resetPasswordSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
  password: z.string().optional(),
});

export const changeAdminStatusSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
  isAdmin: z.string().length(1, "Provide proper status information"),
});
