import { Request, Response } from "express";

import { AppDataSource } from "../data-source.js";
import { RecordStatus } from "../enums/enum.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { AccountGroupInfo } from "../model/account-groups-info.entity.js";
import { AccountGroups } from "../model/account-groups.entity.js";
import { Account } from "../model/account.entity.js";
import { AccountService } from "../services/account.service.js";
import { AppLogger } from "../services/logger.service.js";
import { AccountTypes } from "../types/app/types.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateNewID } from "../utils/generateID.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  createAccountSchema,
  deleteAccountByIdSchema,
  getAccountByIdSchema,
  getAllAccountsSchema,
  updateAccountBalanceSchema,
  updateAccountByIdSchema,
} from "../validators/account.schema.js";
import {
  createAccountGroupsSchema,
  deleteAccountGroupsSchema,
  deleteAcGroupInfoSchema,
  getAccountGroupsSchema,
  getAcGroupInfoSchema,
  updateAccountGroupsSchema,
  updateAcGroupInfoSchema,
} from "../validators/accountGrp.schema.js";

const accountService = new AccountService(
  AppDataSource.getRepository(Account),
  AppDataSource.getRepository(AccountGroups),
  AppDataSource.getRepository(AccountGroupInfo),
);
const logger = AppLogger.getChildLogger("UserController");

export const createAccount = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Create Account Request Data is : ${JSON.stringify(req.body)}`);
  const createAccountData = validateRequest(createAccountSchema, {
    accountId: generateNewID("AC"),
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userId,
    status: RecordStatus.NEW,
    ...req.body,
  });

  logger.info(
    `Create Account Validated Request Data is : ${JSON.stringify(
      createAccountData,
    )}`,
  );

  const account: AccountTypes =
    await accountService.createAccount(createAccountData);
  sendResponseJSON(res, 201, account);
});

export const getAllAccounts = catchAsync(
  async (req: Request, res: Response) => {
    // const { userId } = validateRequest(getAllAccountsSchema, req.user?.userId);
    const { userId } = validateRequest(getAllAccountsSchema, req.query); // temporarily needed until used with JWT logins

    const account: AccountTypes[] = await accountService.getAllAccounts(userId);
    sendResponseJSON(res, 201, account);
  },
);

export const getAccountById = catchAsync(
  async (req: Request, res: Response) => {
    // const { userId } = validateRequest(getAllAccountsSchema, req.user?.userId);
    const accountData = validateRequest(getAccountByIdSchema, {
      userId: req.query["userId"],
      accountId: req.params["accountId"],
    }); // temporarily needed until used with JWT logins

    const account: AccountTypes =
      await accountService.getAccountById(accountData);
    sendResponseJSON(res, 201, account);
  },
);

export const updateAccountById = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(updateAccountByIdSchema, {
      modifiedBy: req.user.userId,
      ...req.body,
    });

    const account = await accountService.updateAccountById(accountData);

    sendResponseJSON(res, 201, account);
  },
);
export const deleteAccountById = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(deleteAccountByIdSchema, req.query);
    const statusMessage = await accountService.deleteAccountById(accountData);
    sendResponseJSON(res, 201, statusMessage);
  },
);
export const updateAccountBalance = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(updateAccountBalanceSchema, {
      modifiedBy: req.user.userId,
      ...req.body,
    });

    const account = await accountService.updateAccountBalance(accountData);
    sendResponseJSON(res, 201, account);
  },
);

export const createAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const createAcGrpData = validateRequest(createAccountGroupsSchema, {
      groupId: generateNewID("GP"),
      createdBy: req.user?.userId,
      modifiedBy: req.user?.userId,
      status: RecordStatus.NEW,
      ...req.body,
    });

    const accountGrp = await accountService.createAccountGroup(createAcGrpData);
    logger.debug(`New account group is created as ${accountGrp}`);
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const getAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const getAcGrpData = validateRequest(getAccountGroupsSchema, req.query); // temporarily needed until used with JWT logins

    const accountGrp = await accountService.getAccountGroup(getAcGrpData);
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const getAcGroupInfo = catchAsync(
  async (req: Request, res: Response) => {
    const getAcGrpInfoData = validateRequest(getAcGroupInfoSchema, req.query); // temporarily needed until used with JWT logins

    const accountGrp = await accountService.getAcGroupInfo(getAcGrpInfoData);
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const getAllAcGroupInfo = catchAsync(
  async (_: Request, res: Response) => {
    const accountGrp = await accountService.getAllAcGroupInfo();
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const updateAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const reqBodyData = req.body.map((data: object) => {
      return { ...data, modifiedBy: req.user.userId };
    });

    const accountGrpData = validateRequest(
      updateAccountGroupsSchema,
      reqBodyData,
    );

    const account = await accountService.updateAccountGroup(accountGrpData);

    sendResponseJSON(res, 201, account);
  },
);

export const updateAcGroupInfo = catchAsync(
  async (req: Request, res: Response) => {
    const updateAcGrInfoData = validateRequest(updateAcGroupInfoSchema, {
      ...req.body,
      modifiedBy: req.user.userId,
    });

    const updatedAcGrInfo =
      await accountService.updateAcGroupInfo(updateAcGrInfoData);

    sendResponseJSON(res, 201, updatedAcGrInfo);
  },
);

export const deleteAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(deleteAccountGroupsSchema, req.body);
    const deletedAccountGroup =
      await accountService.deleteAccountGroup(accountData);
    sendResponseJSON(res, 201, deletedAccountGroup);
  },
);

export const deleteAcGroupInfo = catchAsync(
  async (req: Request, res: Response) => {
    const acGrpInfoData = validateRequest(deleteAcGroupInfoSchema, req.body);
    const deletedAcGroupInfo =
      await accountService.deleteAcGroupInfo(acGrpInfoData);
    sendResponseJSON(res, 201, deletedAcGroupInfo);
  },
);
