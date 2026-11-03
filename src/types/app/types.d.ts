import z from "zod";

import {
  updateAccountByIdSchema,
  getAccountByIdSchema,
  deleteAccountByIdSchema,
  updateAccountBalanceSchema,
} from "../../validators/account.schema.ts";
import {
  accountGroupSchema,
  createAccountGroupsSchema,
  deleteAccountGroupsSchema,
  deleteAcGroupInfoSchema,
  getAccountGroupsSchema,
  getAcGroupInfoSchema,
  updateAccountGroupsSchema,
  updateAcGroupInfoSchema,
} from "../../validators/accountGrp.schema.ts";
import {
  createBudgetSchema,
  getBudgetByIdSchema,
  getAllBudgetsForUserSchema,
  updateBudgetSchema,
  deleteBudgetSchema,
  deleteAllBudgetsForUserSchema,
} from "../../validators/budgetplanning.schema.ts";
import {
  deleteOperationSchema,
  deleteOtoSchema,
  deleteTransactionSchema,
  generateTransactionsSchema,
  getOperationByIdSchema,
  getOperationSchema,
  getOtoByIdSchema,
  getOtoSchema,
  getTransactionsSchema,
  updateTransactionSchema,
} from "../../validators/transaction.schema.ts";
import {
  createUserSchema,
  deleteUserByIdSchema,
  getUserByIdSchema,
  updateUserByIdSchema,
} from "../../validators/user.schema.ts";

export interface BaseTypes {
  id: string;
  dateCreated: Date;
  dateModified: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface AccountTypes extends BaseTypes {
  accountId: string;
  accountType: string;
  accountSubtype: string;
  accountName: string;
  status: string;
  balance: number;
  userId: string;
  currency: string;
}

export type GetAccountByIdInput = z.infer<typeof getAccountByIdSchema>;
export type UpdateAccountByIdInput = z.infer<typeof updateAccountByIdSchema>;
export type DeleteAccountByIdInput = z.infer<typeof deleteAccountByIdSchema>;
export type UpdateAccountBalanceInput = z.infer<
  typeof updateAccountBalanceSchema
>;

export type AccountGroupsTypes = z.infer<typeof accountGroupSchema>;
export type createAccountGroupsType = z.infer<typeof createAccountGroupsSchema>;
export type updateAccountGroupsType = z.infer<typeof updateAccountGroupsSchema>;
export type updateAcGroupInfoType = z.infer<typeof updateAcGroupInfoSchema>;
export type getAccountGroupsType = z.infer<typeof getAccountGroupsSchema>;
export type getAcGroupInfoType = z.infer<typeof getAcGroupInfoSchema>;
export type deleteAccountGroupsType = z.infer<typeof deleteAccountGroupsSchema>;
export type deleteAcGroupInfoType = z.infer<typeof deleteAcGroupInfoSchema>;

export type AttributeMasterTypes = {
  attribute: string;
  attributeCode: string;
  attribute_value: string;
};

export type AuditValidationsTypes = {
  auditId: string;
  userId: string;
  accountId: string;
  validationType: number;
  isLax: boolean;
  amount: number;
  dataType: string;
};

export interface AuthTypes extends BaseTypes {
  userId: string;
  password: string;
  isAdmin: string;
  user?: UserTypes;
}

// export type LoginDetailsTypes = Required<
//   Pick<AuthTypes, "userId" | "password">
// >;

export interface LoginObjectTypes {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
}

export type Config = z.infer<typeof envSchema>;

export type ResponseObject<T> =
  | { success: true; data: T | T[] | Record<string, T> }
  | { success: false; error: string; code?: number };

export interface OperationTypes extends BaseTypes {
  operationId: string;
  userId: string;
  accountId: string;
  operationType: string;
  dataType: string;
  operatingAmount: number;
  frequency: number;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface OtoTypes extends BaseTypes {
  operationId: string;
  userId: string;
  accountId: string;
  operationType: string;
  dataType: string;
  operatingAmount: number;
  operationDate: Date;
}

export interface TransactionTypes extends BaseTypes {
  transactionId: string;
  transactionDate: Date;
  userId: string;
  accountId: string;
  initialAmount: number;
  operationType: string;
  status: string;
  operatingAmount: number;
  endAmount: number;
  transactionType: string;
}

export type getOperationTypes = z.infer<typeof getOperationSchema>;
export type getOperationByIdTypes = z.infer<typeof getOperationByIdSchema>;
export type updateOperationByIdTypes = z.infer<
  typeof updateOperationByIdSchema
>;
export type deleteOperationTypes = z.infer<typeof deleteOperationSchema>;

export type getOtoTypes = z.infer<typeof getOtoSchema>;
export type getOtoByIdTypes = z.infer<typeof getOtoByIdSchema>;
export type updateOtoByIdTypes = z.infer<typeof updateOtoByIdSchema>;
export type deleteOtoTypes = z.infer<typeof deleteOtoSchema>;

// export type TransactionReturn<T> = T extends any[]
//   ? Transaction[]
//   : Transaction;
export type getTransactionTypes = z.infer<typeof getTransactionsSchema>;
export type updateTransactionTypes = z.infer<typeof updateTransactionSchema>;
export type deleteTransactionTypes = z.infer<typeof deleteTransactionSchema>;
export type generateTransactionTypes = z.infer<
  typeof generateTransactionsSchema
>;

export type generatedTransactionDataTypes = {
  userId: OperationTypes["userId"];
  accountId?: OperationTypes["accountId"][];
  startDate: OperationTypes["startDate"];
  endDate: OperationTypes["endDate"];
};

export interface UserTypes extends BaseTypes {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateCreated: Date;
  dateModified: Date;
  status: string;
  userSecurity?: UserSecTypes;
}

export type getUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type updateUserByIdInput = z.infer<typeof updateUserByIdSchema>;
export type deleteUserByIdInput = z.infer<typeof deleteUserByIdSchema>;
export type createUserInput = z.infer<typeof createUserSchema>;

export type UserLoginType = Pick<UserTypes, "userId"> &
  Pick<AuthTypes, "password">;

export type WorkingTransactionTypes = {
  transactionId: string;
  transactionDate: Date;
  userId: string;
  accountId: string;
  initialAmount: number;
  operationType: string;
  status: string;
  operatingAmount: number;
  endAmount: number;
  transactionType: string;
};

export interface BudgetTypes extends BaseTypes {
  budgetId: string;
  userId: string;
  accountId: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
}

export type createBudgetTypes = z.infer<typeof createBudgetSchema>;
export type getBudgetByIdTypes = z.infer<typeof getBudgetByIdSchema>;
export type getAllBudgetsForUserTypes = z.infer<
  typeof getAllBudgetsForUserSchema
>;
export type updateBudgetTypes = z.infer<typeof updateBudgetSchema>;
export type deleteBudgetTypes = z.infer<typeof deleteBudgetSchema>;
export type deleteAllBudgetsForUserTypes = z.infer<
  typeof deleteAllBudgetsForUserSchema
>;
