// /*
// this service will contain options for all transactions related operations
// - one time operations
// - transactions main table
// - transactions view that basically generates the transactions versions of one time operations
// - view that combines transactions view and manually added transactions
// */

import { Logger } from "pino";
import {
  Between,
  DeepPartial,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";
import z from "zod";

import { AppLogger } from "./logger.service.js";
import { RecordStatus } from "../enums/enum.js";
import { GenerateTransactionsView } from "../model/generate-transactions.view.js";
import { OneTimeOperation } from "../model/one-time-operation.entity.js";
import { Operations } from "../model/operations.entity.js";
import { Transaction } from "../model/transaction.entity.js";
import {
  deleteOperationTypes,
  deleteOtoTypes,
  deleteTransactionTypes,
  generateTransactionTypes,
  getOperationByIdTypes,
  getOperationTypes,
  getOtoByIdTypes,
  getOtoTypes,
  getTransactionTypes,
  updateOperationByIdTypes,
  updateTransactionTypes,
} from "../types/app/types.js";
import { AppError } from "../utils/error.util.js";
import {
  createTransactionSchema,
  transactionMainSchema,
} from "../validators/transaction.schema.js";

export class TransactionService {
  private logger: Logger;
  constructor(
    private readonly operationRepository: Repository<Operations>,
    private readonly otoRepository: Repository<OneTimeOperation>,
    private readonly transactionRepository: Repository<Transaction>,
    private readonly generateTransactionsVwRepository: Repository<GenerateTransactionsView>,
  ) {
    this.logger = AppLogger.getChildLogger("TransactionService");
  }

  async createOperation(data: DeepPartial<Operations>): Promise<Operations> {
    try {
      // const operation = this.operationRepository.create(data);
      const { userId, accountId, ...operationData } = data;
      const operation = this.operationRepository.create({
        ...operationData,
        user: {
          userId,
        },
        account: {
          accountId,
        },
      });
      return await this.operationRepository.save(operation);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverErrorCode = error.driverError.code as string;
        if (driverErrorCode === "23505")
          throw new AppError("Operation already exists", 409, error);
      }
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async createOneTimeOperation(
    data: DeepPartial<OneTimeOperation>,
  ): Promise<OneTimeOperation> {
    try {
      // const operation = this.otoRepository.create(data);
      const { userId, accountId, ...operationData } = data;
      const operation = this.otoRepository.create({
        ...operationData,
        user: {
          userId,
        },
        account: {
          accountId,
        },
      });
      return await this.otoRepository.save(operation);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverErrorCode = error.driverError.code as string;
        if (driverErrorCode === "23505")
          throw new AppError("Operation already exists", 409, error);
      }
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  // // first two declarations are typescript method overload signatures, purely TS declaration bullshit nothing functional here.
  // // One takes singular item while other is array of items with similar return patterns making a generic signature.
  // async createTransaction(data: DeepPartial<Transaction>): Promise<Transaction>;

  // async createTransaction(
  //   data: DeepPartial<Transaction>[],
  // ): Promise<Transaction[]>;

  // async createTransaction(
  //   data: DeepPartial<Transaction> | DeepPartial<Transaction>[],
  // ): Promise<Transaction | Transaction[]> {
  //   try {
  //     if (Array.isArray(data)) {
  //       //   const transactions = data.map(
  //       //     ({ userId, accountId, ...transactionData }) => ({
  //       //       ...transactionData,
  //       //       user: {
  //       //         userId,
  //       //       },
  //       //       account: {
  //       //         accountId,
  //       //       },
  //       //     }),
  //       //   );
  //       const operation = this.transactionRepository.create(data);
  //       return await this.transactionRepository.save(operation);
  //     } else {
  //       // const { userId, accountId, ...transactionData } = data;
  //       // const operation = this.transactionRepository.create({
  //       //   ...transactionData,
  //       //   user: {
  //       //     userId,
  //       //   },
  //       //   account: {
  //       //     accountId,
  //       //   },
  //       // });
  //       const operation = this.transactionRepository.create(data);
  //       return await this.transactionRepository.save(operation);
  //     }
  //   } catch (error: unknown) {
  //     if (error instanceof QueryFailedError) {
  //       const driverErrorCode = error.driverError as string;
  //       if (driverErrorCode === "23505")
  //         throw new AppError("Account already exists", 409, error);
  //     }
  //     throw new AppError(
  //       "Internal Server Error",
  //       500,
  //       error instanceof Error ? error : undefined,
  //     );
  //   }
  // }

  async createTransaction(
    data: z.infer<typeof createTransactionSchema>,
  ): Promise<z.infer<typeof transactionMainSchema>[]> {
    try {
      const transactions = await this.transactionRepository.insert(data);

      // // 2. Attach any database-generated IDs
      // const insertedRows = data.map((item, index) => ({
      //   ...item,
      //   id:
      //     transactions.identifiers[index]?.["id"] ??
      //     (item as Record<string, unknown>)["id"],
      // }));

      return z.array(transactionMainSchema).parse(transactions);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverErrorCode = error.driverError.code as string;
        if (driverErrorCode === "23505")
          throw new AppError("Transaction already exists", 409, error);
      }
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getOperations(data: getOperationTypes): Promise<Operations[]> {
    try {
      const where: FindOptionsWhere<Operations> = {
        status: Not(RecordStatus.DELETED),
        userId: data.userId,
      };

      // Not Looping on purpose since it's simpler and faster, more than 5 keys and would loop over this.
      if (data.accountId) where.accountId = data.accountId;
      if (data.startDate) where.startDate = MoreThanOrEqual(data.startDate);
      if (data.endDate) where.endDate = LessThanOrEqual(data.endDate);

      return await this.operationRepository.find({
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

  async getOneTimeOperations(data: getOtoTypes): Promise<OneTimeOperation[]> {
    try {
      const where: FindOptionsWhere<OneTimeOperation> = {
        status: Not(RecordStatus.DELETED),
        userId: data.userId,
      };

      // Not Looping on purpose since it's simpler and faster, more than 5 keys and would loop over this.
      if (data.accountId) where.accountId = data.accountId;
      if (!!data.startDate && !!data.endDate)
        where.operationDate = Between(data.startDate, data.endDate);

      return await this.otoRepository.find({
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

  async getTransactions(data: getTransactionTypes): Promise<Transaction[]> {
    try {
      const where: FindOptionsWhere<Transaction> = {
        status: Not(RecordStatus.DELETED),
        userId: In(data.userId),
      };

      if (data.accountId?.length) where.accountId = In(data.accountId);
      if (data.transactionId?.length)
        where.transactionId = In(data.transactionId);
      if (!!data.startDate && !!data.endDate)
        where.transactionDate = Between(data.startDate, data.endDate);

      return await this.transactionRepository.find({
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

  async getOperationById(data: getOperationByIdTypes): Promise<Operations> {
    try {
      const operationData = await this.operationRepository.findOneBy({
        status: Not(RecordStatus.DELETED),
        operationId: data.operationId,
      });

      if (!operationData) {
        throw new AppError("Budget Data not found", 404);
      }

      return operationData;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getOneTimeOperationById(
    data: getOtoByIdTypes,
  ): Promise<OneTimeOperation> {
    try {
      const otoData = await this.otoRepository.findOneBy({
        status: Not(RecordStatus.DELETED),
        operationId: data.operationId,
      });

      if (!otoData) {
        throw new AppError("Budget Data not found", 404);
      }

      return otoData;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async updateOperationById(
    data: updateOperationByIdTypes,
  ): Promise<Operations> {
    try {
      const operationData = await this.getOperationById({
        operationId: data.operationId,
      });

      if (operationData.status === RecordStatus.NEW) {
        operationData.status = RecordStatus.MODIFIED;
      }

      Object.assign(operationData, data);

      return await this.operationRepository.save(operationData);
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async updateOneTimeOperationById(
    data: updateOperationByIdTypes,
  ): Promise<OneTimeOperation> {
    try {
      const operationData = await this.getOneTimeOperationById({
        operationId: data.operationId,
      });

      if (operationData.status === RecordStatus.NEW) {
        operationData.status = RecordStatus.MODIFIED;
      }

      Object.assign(operationData, data);

      return await this.otoRepository.save(operationData);
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async updateTransaction(
    data: updateTransactionTypes,
  ): Promise<Transaction[]> {
    try {
      data.forEach((transaction) => {
        if (transaction.status === RecordStatus.NEW) {
          transaction.status = RecordStatus.MODIFIED;
        }
      });

      return await this.transactionRepository.save(data);
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async deleteOperation(data: deleteOperationTypes): Promise<string> {
    try {
      const operationData = await this.getOperationById(data);

      operationData.status = RecordStatus.DELETED;

      await this.operationRepository.save(operationData);

      this.logger.info(`${operationData.operationId} Successfully Deleted`);

      return `${operationData.operationId} Successfully Deleted`;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async deleteOneTimeOperation(data: deleteOtoTypes): Promise<string> {
    try {
      const operationData = await this.getOneTimeOperationById(data);

      operationData.status = RecordStatus.DELETED;

      await this.otoRepository.save(operationData);

      this.logger.info(`${operationData.operationId} Successfully Deleted`);

      return `${operationData.operationId} Successfully Deleted`;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async deleteTransactions(data: deleteTransactionTypes): Promise<string> {
    try {
      const where: FindOptionsWhere<Transaction> = {
        status: Not(RecordStatus.DELETED),
        userId: In(data.userId),
      };

      if (data.accountId?.length) {
        where.accountId = In(data.accountId);
      }

      if (data.transactionId?.length) {
        where.transactionId = In(data.transactionId);
      }

      if (data.startDate && data.endDate) {
        where.transactionDate = Between(data.startDate, data.endDate);
      }

      const result = await this.transactionRepository.update(where, {
        status: RecordStatus.DELETED,
      });

      this.logger.info(`${result.affected} records are successfully removed.`);

      return `${result.affected} records are successfully removed.`;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async generateTransactionData(
    data: generateTransactionTypes,
  ): Promise<GenerateTransactionsView[]> {
    try {
      const where: FindOptionsWhere<Transaction> = {
        status: Not(RecordStatus.DELETED),
        userId: data.userId,
        transactionDate: Between(data.startDate, data.endDate),
      };

      if (data.accountId?.length) where.accountId = In(data.accountId);

      return await this.generateTransactionsVwRepository.find({
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
}
