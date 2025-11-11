import z from "zod";
import { AccountEnums } from "../enums/enum.js";

export const createAccountSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  accountType: z.string().nonempty("Account Type is required"),
  accountSubtype: z.string().nonempty("Account Sub Type is required"),
  accountName: z.string().nonempty("Account Name is required"),
  status: z.string().default(AccountEnums.ACCOUNT_NEW),
  balance: z
    .string()
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

export const getAllAccountsSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

export const getAccountByIdSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  userId: z.string().nonempty("User ID is required"),
});

export const deleteAccountByIdSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  userId: z.string().nonempty("User ID is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const updateAccountByIdSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  accountType: z.string().optional(),
  accountSubtype: z.string().optional(),
  accountName: z.string().optional(),
  status: z.string().optional(),
  balance: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "balance must be number",
    })
    .optional(),
  userId: z.string().nonempty("User ID is required"),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});

export const updateAccountBalanceSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  balance: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "balance must be number",
    })
    .optional(),
  userId: z.string().nonempty("User ID is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
});
