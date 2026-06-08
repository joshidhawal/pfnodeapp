import z from "zod";

const authSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
  password: z.string().nonempty("Password is required"),
});

export const signupSchema = authSchema.pick({
  userId: true,
  createdBy: true,
  modifiedBy: true,
  password: true,
});

export const getUserAuthSchema = authSchema.pick({
  userId: true,
});

export const resetPasswordSchema = authSchema.pick({
  userId: true,
  modifiedBy: true,
  password: true,
});

export const changeAdminStatusSchema = authSchema.pick({
  userId: true,
  modifiedBy: true,
  isAdmin: true,
});
