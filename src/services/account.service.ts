import { Logger } from "pino";
import { DeepPartial, Not, QueryFailedError, Repository } from "typeorm";

import { AppLogger } from "./logger.service.js";
import { RecordStatus } from "../enums/enum.js";
import { Account } from "../model/account.entity.js";
import {
  AccountTypes,
  DeleteAccountByIdInput,
  GetAccountByIdInput,
  UpdateAccountBalanceInput,
  UpdateAccountByIdInput,
} from "../types/app/types.js";
import { AppError } from "../utils/error.util.js";

export class AccountService {
  private logger: Logger;
  constructor(private readonly accountRepository: Repository<Account>) {
    this.logger = AppLogger.getChildLogger("AccountService");
  }

  async createAccount(data: DeepPartial<AccountTypes>): Promise<AccountTypes> {
    try {
      const newAccount = this.accountRepository.create(data);
      return await this.accountRepository.save(newAccount);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverErrorCode = error.driverError as string;
        if (driverErrorCode === "23505")
          throw new AppError("Account already exists", 409, error);
      }
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getAllAccounts(userId: string): Promise<AccountTypes[]> {
    try {
      return await this.accountRepository.find({
        where: {
          status: Not(RecordStatus.DELETED),
          userId: userId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async getAccountById(
    accountDataInput: GetAccountByIdInput,
  ): Promise<AccountTypes> {
    try {
      const accountData = await this.accountRepository.findOneBy({
        status: Not(RecordStatus.DELETED),
        userId: accountDataInput.userId,
        accountId: accountDataInput.accountId,
      });

      if (!accountData) {
        throw new AppError("Account not found", 404);
      }

      return accountData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async updateAccountById(data: UpdateAccountByIdInput): Promise<AccountTypes> {
    try {
      const account = await this.getAccountById({
        accountId: data.accountId,
        userId: data.userId,
      });

      // if (!account) {
      //   throw new AppError("Account not found", 404);
      // }

      Object.assign(account, data);

      if (account.status === RecordStatus.NEW) {
        account.status = RecordStatus.MODIFIED;
      }

      // const newAccount = this.accountRepository.create(account);
      return await this.accountRepository.save(account);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async deleteAccountById(
    accountData: DeleteAccountByIdInput,
  ): Promise<string> {
    try {
      const account = await this.getAccountById(accountData);

      // if (!account) {
      //   throw new AppError("Account not found", 404);
      // }

      account.status = RecordStatus.DELETED;

      await this.accountRepository.save(account);

      this.logger.info(`Account : ${account.userId} Successfully Deleted`);

      return `Account : ${account.userId} Successfully Deleted`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError("Internal Server Error", 500, error);
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async updateAccountBalance(
    accountData: UpdateAccountBalanceInput,
  ): Promise<AccountTypes> {
    const account = await this.getAccountById({
      accountId: accountData.accountId,
      userId: accountData.userId,
    });

    // if (!account) {
    //   throw new AppError("Account not found", 404);
    // }

    account.balance = accountData.balance;
    account.modifiedBy = accountData.modifiedBy;

    const updateAccount = await this.accountRepository.save(account);

    return updateAccount;
  }
}
