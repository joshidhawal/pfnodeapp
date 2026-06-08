import { Logger } from "pino";
import { DeepPartial, Not, QueryFailedError, Repository } from "typeorm";

import { AppLogger } from "./logger.service.js";
import { RecordStatus } from "../enums/enum.js";
import { BudgetPlanning } from "../model/budget-planning.js";
import {
  BudgetTypes,
  DeleteAccountByIdInput,
  getAllBudgetsForUserTypes,
  getBudgetByIdTypes,
  updateBudgetTypes,
} from "../types/app/types.js";
import { AppError } from "../utils/error.util.js";

export class BudgetPlanningService {
  private logger: Logger;
  constructor(
    private readonly budgetPlanningRepository: Repository<BudgetPlanning>,
  ) {
    this.logger = AppLogger.getChildLogger("BudgetPlanningService");
  }

  async createBudget(data: DeepPartial<BudgetTypes>): Promise<BudgetPlanning> {
    try {
      const newBudget = this.budgetPlanningRepository.create(data);
      return await this.budgetPlanningRepository.save(newBudget);
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

  async getAllBudgetsForUser(
    data: getAllBudgetsForUserTypes,
  ): Promise<BudgetPlanning[]> {
    try {
      const where: any = {
        status: Not(RecordStatus.DELETED),
        userId: data.userId,
      };

      if (data.accountId) where.accountId = data.accountId;

      return await this.budgetPlanningRepository.find({
        where: where,
      });
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getBudgetById(data: getBudgetByIdTypes): Promise<BudgetPlanning> {
    try {
      const budgetData = await this.budgetPlanningRepository.findOneBy({
        status: Not(RecordStatus.DELETED),
        userId: data.userId,
        accountId: data.accountId,
        budgetId: data.budgetId,
      });

      if (!budgetData) {
        throw new AppError("Budget Data not found", 404);
      }

      return budgetData;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async updateBudget(data: updateBudgetTypes): Promise<BudgetPlanning> {
    try {
      const budgetData = await this.getBudgetById({
        userId: data.userId,
        accountId: data.accountId,
        budgetId: data.budgetId,
      });

      if (budgetData.status === RecordStatus.NEW) {
        budgetData.status = RecordStatus.MODIFIED;
      }

      Object.assign(budgetData, data);

      // const newBudget = this.budgetPlanningRepository.create(budgetData);
      return await this.budgetPlanningRepository.save(budgetData);
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async deleteBudget(data: DeleteAccountByIdInput): Promise<string> {
    try {
      const budgetData = await this.getBudgetById(data);

      budgetData.status = RecordStatus.DELETED;

      Object.assign(budgetData, data);

      await this.budgetPlanningRepository.save(budgetData);

      this.logger.info(
        `BudgetPlanning : ${budgetData.budgetId} Successfully Deleted`,
      );

      return `BudgetPlanning : ${budgetData.budgetId} Successfully Deleted`;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async deleteAllBudgetsForUser(data: DeleteAccountByIdInput): Promise<string> {
    try {
      const where = {
        userId: data.userId,
        accountId: data.accountId,
        status: Not(RecordStatus.DELETED),
      };
      const budgetCount = await this.budgetPlanningRepository.count({
        where: where,
      });

      if (budgetCount < 1) {
        throw new AppError("Budget Data not found", 404);
      }

      // Since we are updating directly running it via a query, it doesn't apply lifecycle hooks
      // and other utilities when using save().
      // Keep this in mind.
      await this.budgetPlanningRepository
        .createQueryBuilder()
        .update(BudgetPlanning)
        .set({ status: RecordStatus.DELETED })
        .where(where)
        .andWhere("status <> :deletedStatus", {
          deletedStatus: RecordStatus.DELETED,
        })
        .execute();

      this.logger.info(
        `Budget Planning : ${result.affected} budgets Successfully Deleted`,
      );

      return `Budget Planning : All Budgets deleted for ${data.userId} Successfully Deleted`;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }
}
