import { Logger } from "pino";
import {
  DeleteResult,
  FindOptionsWhere,
  In,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";

import { AppLogger } from "./logger.service.js";
import { RecordStatus } from "../enums/enum.js";
import { AccountGroupInfo } from "../model/account-groups-info.entity.js";
import { AccountGroups } from "../model/account-groups.entity.js";
import {
  createAccountGroupsType,
  deleteAccountGroupsType,
  deleteAcGroupInfoType,
  getAccountGroupsType,
  getAcGroupInfoType,
  updateAccountGroupsType,
  updateAcGroupInfoType,
} from "../types/app/types.js";
import { AppError } from "../utils/error.util.js";

export class AccountGroupService {
  private logger: Logger;

  constructor(
    private readonly accountGroupRepository: Repository<AccountGroups>,
    private readonly accountGroupInfoRepository: Repository<AccountGroupInfo>,
  ) {
    this.logger = AppLogger.getChildLogger("AccountGroupService");
  }

  async createAccountGroup(data: createAccountGroupsType): Promise<{
    newGroupInfo: AccountGroupInfo;
    newAccountGroup: AccountGroups[];
  }> {
    try {
      const newAccountGrpArray = data.accountId.map((account) => {
        return { groupId: data.groupId, accountId: account };
      });

      const newAccountGrpInfo = {
        groupId: data.groupId,
        groupName: data.groupName,
        status: data.status,
      };

      const newAccountGroupData =
        this.accountGroupRepository.create(newAccountGrpArray);

      const newAccountGroupInfoData =
        this.accountGroupInfoRepository.create(newAccountGrpInfo);

      const newGroupInfo = await this.accountGroupInfoRepository.save(
        newAccountGroupInfoData,
      );

      const newAccountGroup =
        await this.accountGroupRepository.save(newAccountGroupData);

      return { newGroupInfo: newGroupInfo, newAccountGroup: newAccountGroup };
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverErrorCode = error.driverError.code as string;
        if (driverErrorCode === "23505")
          throw new AppError("Account Group already exists", 409, error);
      }
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getAccountGroup(data: getAccountGroupsType): Promise<AccountGroups[]> {
    try {
      const where: FindOptionsWhere<AccountGroups> = {
        groupId: data.groupId,
      };

      if (data.accountId) where.accountId = data.accountId;

      return await this.accountGroupRepository.find({
        where: where,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async getAcGroupInfo(data: getAcGroupInfoType): Promise<AccountGroupInfo> {
    try {
      const acGroupInfo = await this.accountGroupInfoRepository.findOneBy({
        groupId: data,
        status: Not(RecordStatus.DELETED),
      });

      if (!acGroupInfo) {
        throw new AppError("No Such Group", 400);
      }

      return acGroupInfo;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async getAllAcGroupInfo(): Promise<AccountGroupInfo[]> {
    try {
      return this.accountGroupInfoRepository.find({
        where: { status: Not(RecordStatus.DELETED) },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async updateAccountGroup(
    data: updateAccountGroupsType,
  ): Promise<AccountGroups[]> {
    try {
      const groupIds = [
        ...new Set(data.map(({ groupId }) => groupId).filter(Boolean)),
      ];

      const deletedOldGroups = await this.deleteAccountGroup({
        groupId: groupIds,
      });

      let newAccountGroup: AccountGroups[] = [];

      if (deletedOldGroups.affected && deletedOldGroups.affected > 0) {
        const newAccountGroupData = this.accountGroupRepository.create(data);

        newAccountGroup =
          await this.accountGroupRepository.save(newAccountGroupData);
      }

      return newAccountGroup;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async updateAcGroupInfo(
    data: updateAcGroupInfoType,
  ): Promise<AccountGroupInfo> {
    try {
      const groupInfo = await this.getAcGroupInfo(data.groupId);

      Object.assign(groupInfo, data);

      if (groupInfo.status === RecordStatus.NEW)
        groupInfo.status = RecordStatus.MODIFIED;

      return await this.accountGroupInfoRepository.save(groupInfo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async deleteAccountGroup(
    data: deleteAccountGroupsType,
  ): Promise<DeleteResult> {
    try {
      let deletedGroup;
      if (data.groupId) {
        deletedGroup = await this.accountGroupRepository.delete({
          groupId: In(data.groupId),
        });
      } else if (data.accountId) {
        deletedGroup = await this.accountGroupRepository.delete({
          groupId: In(data.accountId),
        });
      } else {
        throw new AppError(
          "GroupId or AccountId one of these should be provided.",
          400,
        );
      }
      return deletedGroup;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async deleteAcGroupInfo(data: deleteAcGroupInfoType): Promise<string> {
    try {
      const groupInfo = await this.getAcGroupInfo(data);

      groupInfo.status = RecordStatus.DELETED;

      await this.accountGroupInfoRepository.save(groupInfo);

      this.logger.info(`Group Info : ${data} Successfully Deleted`);

      return `Group Info : ${data} Successfully Deleted`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }
}
