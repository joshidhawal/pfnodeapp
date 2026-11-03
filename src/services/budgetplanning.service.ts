import { Logger } from "pino";
import {
  DeepPartial,
  FindOptionsWhere,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";

import { AppLogger } from "./logger.service.js";
import { RecordStatus } from "../enums/enum.js";
import { BudgetPlanning } from "../model/budget-planning.js";
import {
  BudgetTypes,
  DeleteAccountByIdInput,
  deleteBudgetTypes,
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
        const driverErrorCode = error.driverError.code as string;
        if (driverErrorCode === "23505")
          throw new AppError("Budget already exists", 409, error);
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
      const where: FindOptionsWhere<BudgetPlanning> = {
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
        error instanceof AppError ? error.statusCode : 500,
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

  async deleteBudget(data: deleteBudgetTypes): Promise<string> {
    try {
      const budgetData = await this.getBudgetById(data);

      budgetData.status = RecordStatus.DELETED;

      Object.assign(budgetData, data);

      await this.budgetPlanningRepository.save(budgetData);

      this.logger.info(`${budgetData.budgetId} Successfully Deleted`);

      return `${budgetData.budgetId} Successfully Deleted`;
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
      // const where = {
      //   userId: data.userId,
      //   accountId: data.accountId,
      //   status: Not(RecordStatus.DELETED),
      // };
      // const budgetCount = await this.budgetPlanningRepository.count({
      //   where: where,
      // });

      // if (budgetCount < 1) {
      //   throw new AppError("Budget Data not found", 404);
      // }

      // Since we are updating directly running it via a query, it doesn't apply lifecycle hooks
      // and other utilities when using save().
      // Keep this in mind.
      // =======================================================================================
      // const result = await this.budgetPlanningRepository
      //   .createQueryBuilder()
      //   .update(BudgetPlanning)
      //   .set({ status: RecordStatus.DELETED, modifiedBy: data.modifiedBy })
      //   .where({
      //     userId: data.userId,
      //     accountId: data.accountId,
      //     status: Not(RecordStatus.DELETED),
      //   })
      //   .execute();
      // =======================================================================================
      // Replacing QueryBuilder with Update command since in future this would be needed to
      // handle the system columns i.e. createdby and modifiedby. Keeping the Query Builder
      // =======================================================================================

      const result = await this.budgetPlanningRepository.update(
        {
          userId: data.userId,
          accountId: data.accountId,
          status: Not(RecordStatus.DELETED),
        },
        { status: RecordStatus.DELETED, modifiedBy: data.modifiedBy },
      );

      this.logger.info(`${result.affected} records are successfully removed.`);

      return `${result.affected} records are successfully removed.`;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        error instanceof AppError ? error.statusCode : 500,
        error instanceof Error ? error : undefined,
      );
    }
  }
}
