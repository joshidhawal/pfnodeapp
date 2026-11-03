import { Request, Response } from "express";

import { AppDataSource } from "../data-source.js";
import { RecordStatus } from "../enums/enum.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { GenerateTransactionsView } from "../model/generate-transactions.view.js";
import { OneTimeOperation } from "../model/one-time-operation.entity.js";
import { Operations } from "../model/operations.entity.js";
import { Transaction } from "../model/transaction.entity.js";
import { AppLogger } from "../services/logger.service.js";
import { TransactionService } from "../services/transaction.service.js";
import { OperationTypes, OtoTypes } from "../types/app/types.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateNewID } from "../utils/generateID.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  createOperationSchema,
  createOtoSchema,
  createTransactionSchema,
  deleteOperationSchema,
  deleteOtoSchema,
  deleteTransactionSchema,
  getOperationByIdSchema,
  getOperationSchema,
  getOtoByIdSchema,
  getOtoSchema,
  getTransactionsSchema,
  updateOperationByIdSchema,
  updateOtoByIdSchema,
  updateTransactionSchema,
} from "../validators/transaction.schema.js";

const transactionService = new TransactionService(
  AppDataSource.getRepository(Operations),
  AppDataSource.getRepository(OneTimeOperation),
  AppDataSource.getRepository(Transaction),
  AppDataSource.getRepository(GenerateTransactionsView),
);
const logger = AppLogger.getChildLogger("TransactionController");

export const createOperation = catchAsync(
  async (req: Request, res: Response) => {
    if (!!req.body.is_recurring) {
      const createOperationData = validateRequest(createOtoSchema, {
        operationId: generateNewID("OP"),
        createdBy: req.user?.userId,
        modifiedBy: req.user?.userId,
        status: RecordStatus.NEW,
        ...req.body,
      });
      logger.info(createOperationData, "Creating New One Time Operation");
      const operation: OtoTypes =
        await transactionService.createOneTimeOperation(createOperationData);
      sendResponseJSON(res, 201, operation);
    } else {
      const createOperationData = validateRequest(createOperationSchema, {
        operationId: generateNewID("OP"),
        createdBy: req.user?.userId,
        modifiedBy: req.user?.userId,
        status: RecordStatus.NEW,
        ...req.body,
      });
      logger.info(createOperationData, "Creating New Recurring Operation");
      const operation: OperationTypes =
        await transactionService.createOperation(createOperationData);
      sendResponseJSON(res, 201, operation);
    }
  },
);

export const getOperationById = catchAsync(
  async (req: Request, res: Response) => {
    if (!!req.body.is_recurring) {
      const operationData = validateRequest(getOperationByIdSchema, req.body);
      const operation =
        await transactionService.getOperationById(operationData);
      sendResponseJSON(res, 200, operation);
    } else {
      const operationData = validateRequest(getOtoByIdSchema, req.body);
      const operation =
        await transactionService.getOneTimeOperationById(operationData);
      sendResponseJSON(res, 200, operation);
    }
  },
);

export const getOperations = catchAsync(async (req: Request, res: Response) => {
  if (!!req.body.is_recurring) {
    const getOperationData = validateRequest(getOtoSchema, req.body);
    const operationArray =
      await transactionService.getOneTimeOperations(getOperationData);
    sendResponseJSON(res, 200, operationArray);
  } else {
    const getOperationData = validateRequest(getOperationSchema, req.body);
    const operationArray =
      await transactionService.getOperations(getOperationData);
    sendResponseJSON(res, 200, operationArray);
  }
});

export const updateOperation = catchAsync(
  async (req: Request, res: Response) => {
    if (!!req.body.is_recurring) {
      const updateOperationByIdData = validateRequest(
        updateOperationByIdSchema,
        req.body,
      );
      const updateOperationById = await transactionService.updateOperationById(
        updateOperationByIdData,
      );
      sendResponseJSON(res, 200, updateOperationById);
    } else {
      const updateOtoByIdData = validateRequest(updateOtoByIdSchema, req.body);
      const updateOtoById =
        await transactionService.updateOneTimeOperationById(updateOtoByIdData);
      sendResponseJSON(res, 200, updateOtoById);
    }
  },
);

export const deleteOperation = catchAsync(
  async (req: Request, res: Response) => {
    if (!!req.body.is_recurring) {
      const deleteOperationByIdData = validateRequest(
        deleteOperationSchema,
        req.body,
      );
      const deleteOperationById = await transactionService.deleteOperation(
        deleteOperationByIdData,
      );
      sendResponseJSON(res, 200, deleteOperationById);
    } else {
      const deleteOtoByIdData = validateRequest(deleteOtoSchema, req.body);
      const deleteOtoById =
        await transactionService.deleteOneTimeOperation(deleteOtoByIdData);
      sendResponseJSON(res, 200, deleteOtoById);
    }
  },
);

export const createTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const createTransactionData = validateRequest(createTransactionSchema, {
      transactionId: generateNewID("TS"),
      ...req.body,
    });
    let createdTransactions;

    // Use a type guard to help TypeScript resolve the correct overload
    if (Array.isArray(createTransactionData)) {
      createdTransactions = await transactionService.createTransaction(
        createTransactionData,
      );
    } else {
      createdTransactions = await transactionService.createTransaction(
        createTransactionData,
      );
    }
    sendResponseJSON(res, 200, createdTransactions);
  },
);

export const getTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const getTransactionData = validateRequest(getTransactionsSchema, req.body);
    const transactionArray =
      await transactionService.getTransactions(getTransactionData);
    sendResponseJSON(res, 200, transactionArray);
  },
);

export const updateTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const updateTransactionData = validateRequest(
      updateTransactionSchema,
      req.body,
    );
    const updatedTransactions = await transactionService.updateTransaction(
      updateTransactionData,
    );
    sendResponseJSON(res, 200, updatedTransactions);
  },
);

export const deleteTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const deleteTransactionData = validateRequest(
      deleteTransactionSchema,
      req.body,
    );
    const deletedTransaction = await transactionService.deleteTransactions(
      deleteTransactionData,
    );
    sendResponseJSON(res, 200, deletedTransaction);
  },
);
