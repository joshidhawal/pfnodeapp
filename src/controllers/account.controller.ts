import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { AccountEnums } from "../enums/enum.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { Account } from "../model/account.entity.js";
import { AccountService } from "../services/account.service.js";
import { AppLogger } from "../services/logger.service.js";
import { AccountTypes } from "../types/app/account.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  createAccountSchema,
  deleteAccountByIdSchema,
  getAccountByIdSchema,
  getAllAccountsSchema,
  updateAccountBalanceSchema,
  updateAccountByIdSchema,
} from "../validators/account.schema.js";

const accountRepository = AppDataSource.getRepository(Account);
const accountService = new AccountService(accountRepository);
const logger = AppLogger.getChildLogger("UserController");

export const createAccount = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Create Account Request Data is : ${JSON.stringify(req.body)}`);
  const createAccountData = validateRequest(createAccountSchema, {
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userRole,
    status: AccountEnums.ACCOUNT_NEW,
    ...req.body,
  });

  logger.info(
    `Create Account Validated Request Data is : ${JSON.stringify(
      createAccountData
    )}`
  );

  const account: AccountTypes = await accountService.createAccount(
    createAccountData
  );
  sendResponseJSON(res, 201, account);
});

export const getAllAccounts = catchAsync(
  async (req: Request, res: Response) => {
    // const { userId } = validateRequest(getAllAccountsSchema, req.user?.userId);
    const { userId } = validateRequest(getAllAccountsSchema, req.query); // temporarily needed until used with JWT logins

    const account: AccountTypes[] = await accountService.getAllAccounts(userId);
    sendResponseJSON(res, 201, account);
  }
);

export const getAccountById = catchAsync(
  async (req: Request, res: Response) => {
    // const { userId } = validateRequest(getAllAccountsSchema, req.user?.userId);
    const accountData = validateRequest(getAccountByIdSchema, {
      userId: req.query.userId,
      accountId: req.params.accountId,
    }); // temporarily needed until used with JWT logins

    const account: AccountTypes = await accountService.getAccountById(
      accountData
    );
    sendResponseJSON(res, 201, account);
  }
);

export const updateAccountById = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(updateAccountByIdSchema, {
      modifiedBy: req.user.userId,
      ...req.body,
    });

    const account = await accountService.updateAccountById(accountData);

    return account;
  }
);
export const deleteAccountById = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(deleteAccountByIdSchema, req.query);
    const statusMessage = await accountService.deleteAccountById(accountData);
    return statusMessage;
  }
);
export const updateAccountBalance = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(updateAccountBalanceSchema, {
      modifiedBy: req.user.userId,
      ...req.body,
    });

    const account = await accountService.updateAccountBalance(accountData);
    return;
  }
);
