import { Request, Response } from "express";

import { AppDataSource } from "../data-source.js";
import { RecordStatus } from "../enums/enum.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { AccountGroupInfo } from "../model/account-groups-info.entity.js";
import { AccountGroups } from "../model/account-groups.entity.js";
import { AccountGroupService } from "../services/accountGroup.service.js";
import { AppLogger } from "../services/logger.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateNewID } from "../utils/generateID.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  createAccountGroupsSchema,
  deleteAccountGroupsSchema,
  deleteAcGroupInfoSchema,
  getAccountGroupsSchema,
  getAcGroupInfoSchema,
  updateAccountGroupsSchema,
  updateAcGroupInfoSchema,
} from "../validators/accountGrp.schema.js";

const accountGrpService = new AccountGroupService(
  AppDataSource.getRepository(AccountGroups),
  AppDataSource.getRepository(AccountGroupInfo),
);
const logger = AppLogger.getChildLogger("UserController");

export const createAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const createAcGrpData = validateRequest(createAccountGroupsSchema, {
      groupId: generateNewID("GP"),
      createdBy: req.user?.userId,
      modifiedBy: req.user?.userId,
      status: RecordStatus.NEW,
      ...req.body,
    });

    const accountGrp =
      await accountGrpService.createAccountGroup(createAcGrpData);
    logger.debug(`New account group is created as ${accountGrp}`);
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const getAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const getAcGrpData = validateRequest(getAccountGroupsSchema, req.query); // temporarily needed until used with JWT logins

    const accountGrp = await accountGrpService.getAccountGroup(getAcGrpData);
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const getAcGroupInfo = catchAsync(
  async (req: Request, res: Response) => {
    const getAcGrpInfoData = validateRequest(getAcGroupInfoSchema, req.query); // temporarily needed until used with JWT logins

    const accountGrp = await accountGrpService.getAcGroupInfo(getAcGrpInfoData);
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const getAllAcGroupInfo = catchAsync(
  async (_: Request, res: Response) => {
    const accountGrp = await accountGrpService.getAllAcGroupInfo();
    sendResponseJSON(res, 201, accountGrp);
  },
);

export const updateAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const reqBodyData = req.body.map((data: any) => {
      return { ...data, modifiedBy: req.user.userId };
    });

    const accountGrpData = validateRequest(
      updateAccountGroupsSchema,
      reqBodyData,
    );

    const account = await accountGrpService.updateAccountGroup(accountGrpData);

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
      await accountGrpService.updateAcGroupInfo(updateAcGrInfoData);

    sendResponseJSON(res, 201, updatedAcGrInfo);
  },
);

export const deleteAccountGroup = catchAsync(
  async (req: Request, res: Response) => {
    const accountData = validateRequest(deleteAccountGroupsSchema, req.body);
    const deletedAccountGroup =
      await accountGrpService.deleteAccountGroup(accountData);
    sendResponseJSON(res, 201, deletedAccountGroup);
  },
);

export const deleteAcGroupInfo = catchAsync(
  async (req: Request, res: Response) => {
    const acGrpInfoData = validateRequest(deleteAcGroupInfoSchema, req.body);
    const deletedAcGroupInfo =
      await accountGrpService.deleteAcGroupInfo(acGrpInfoData);
    sendResponseJSON(res, 201, deletedAcGroupInfo);
  },
);
