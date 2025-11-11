import { Logger } from "pino";
import { Not, Repository } from "typeorm";
import { AccountEnums } from "../enums/enum.js";
import { AppError } from "../utils/error.util.js";
import { Account } from "../model/account.entity.js";
import { AccountTypes } from "../types/app/account.js";
import { AppLogger } from "./logger.service.js";

export class AccountService {
  private logger: Logger;
  constructor(private readonly accountRepository: Repository<Account>) {
    this.logger = AppLogger.getChildLogger("UserService");
  }

  async createAccount(data: Partial<AccountTypes>): Promise<AccountTypes> {
    try {
      const newAccount = this.accountRepository.create(data);
      return await this.accountRepository.save(newAccount);
    } catch (error: any) {
      switch (error.code) {
        case "23505":
          throw new AppError("Account already exists", 409, error);
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async getAllAccounts(userId: string): Promise<AccountTypes[]> {
    try {
      const accountData = this.accountRepository.find({
        where: {
          status: Not(AccountEnums.ACCOUNT_DELETED),
          userId: userId,
        },
      });
      return accountData;
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async getAccountById(
    accountDataInput: Partial<AccountTypes>
  ): Promise<AccountTypes> {
    try {
      const accountData = this.accountRepository.findOneBy({
        status: Not(AccountEnums.ACCOUNT_DELETED),
        userId: accountDataInput.userId,
        accountId: accountDataInput.accountId,
      });
      return accountData;
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async updateAccountById(data: Partial<AccountTypes>): Promise<AccountTypes> {
    try {
      const account = await this.getAccountById({
        accountId: data.accountId,
        userId: data.userId,
      });
      if (!account) return null;

      account.status =
        account.status == AccountEnums.ACCOUNT_NEW
          ? (account.status = AccountEnums.ACCOUNT_MODIFIED)
          : account.status;
      const accountUpdateData = { ...account, ...data };
      const newAccount = this.accountRepository.create(accountUpdateData);
      return await this.accountRepository.save(newAccount);
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async deleteAccountById(accountData: Partial<AccountTypes>): Promise<string> {
    try {
      const account = await this.getAccountById(accountData);

      if (!account) return null;

      account.status = AccountEnums.ACCOUNT_DELETED;

      const result = await this.updateAccountById(account);

      return `Account : ${account.userId} Successfully Deleted`;
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async updateAccountBalance(
    accountData: Partial<AccountTypes>
  ): Promise<AccountTypes> {
    const account = await this.getAccountById({
      accountId: accountData.accountId,
      userId: accountData.userId,
    });

    if (!account) return null;

    account.balance = accountData.balance;
    account.modifiedBy = accountData.modifiedBy;

    const updateAccount = await this.updateAccountById(account);

    return updateAccount;
  }
}
