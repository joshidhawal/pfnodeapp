import z from "zod";

import { RecordStatus } from "../enums/enum.js";

export const createUserSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  email: z.string().nonempty("Email is required"),
  status: z.string().default(RecordStatus.NEW),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const getUserByIdSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

export const updateUserByIdSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
  modifiedBy: z.string().optional(),
});

export const deleteUserByIdSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});
