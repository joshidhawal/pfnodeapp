import z from "zod";

import { RecordStatus } from "../enums/enum.js";

const accountSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  accountType: z.string().nonempty("Account Type is required"),
  accountSubtype: z.string().nonempty("Account Sub Type is required"),
  accountName: z.string().nonempty("Account Name is required"),
  status: z.string().default(RecordStatus.NEW),
  balance: z
    .string()
    .regex(/^\d+(\.\d{1,4})?$/, {
      message: "Balance must have up to 4 decimal places",
    })
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "Account Balance must be a valid amount",
    })
    .default(0),
  userId: z.string().nonempty("User ID is required"),
  currency: z.string().length(3, "Valid Currency Code required"),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const createAccountSchema = accountSchema.pick({
  accountId: true,
  accountType: true,
  accountSubtype: true,
  accountName: true,
  status: true,
  balance: true,
  userId: true,
  currency: true,
  createdBy: true,
  modifiedBy: true,
});

export const getAllAccountsSchema = accountSchema.pick({
  userId: true,
});

export const getAccountByIdSchema = accountSchema.pick({
  accountId: true,
  userId: true,
});

export const deleteAccountByIdSchema = accountSchema.pick({
  accountId: true,
  userId: true,
  modifiedBy: true,
});

export const updateAccountByIdSchema = accountSchema.pick({
  accountId: true,
  accountType: true,
  accountSubtype: true,
  accountName: true,
  status: true,
  balance: true,
  userId: true,
  createdBy: true,
  modifiedBy: true,
});

export const updateAccountBalanceSchema = accountSchema.pick({
  accountId: true,
  balance: true,
  userId: true,
  modifiedBy: true,
});
