/*
- workbench table -- if published fetch data from transaction entity otherwise fetch from workbench entity
- workbench header -- same table with only status changed as published or WIP
- workbench summary view
- 
- createWorkbench; // creates scope and entries in table.
- updateWorkbench; // updates only working workbench table - header is immutable.
- publishWorkbench; // publish transactions entities from workbench to transaction.
- unpublishWorkbench; //delete transactions from workbench and regenerate workbench records.
- deleteWorkbench; // remove both scope and workbench entries - works only for unpublished.
- deletePublishedWorkbench; // removes scope and transaction table entries.

- getWorkbench; // Takes scope and sees if transactions is published or working and returns records accordingly.
- getWorkbenchSummary; //shows workbench summary details for the short info bar in the workbench screen with aggregations.
- refreshWorkbench; // refreshes worbench view and summary views
*/

import { Logger } from "pino";
import { QueryFailedError, Repository } from "typeorm";

import { AppLogger } from "./logger.service.js";
import { TransactionService } from "./transaction.service.js";
import { GenerateTransactionsView } from "../model/generate-transactions.view.js";
import { Header } from "../model/header.entity.js";
import { OneTimeOperation } from "../model/one-time-operation.entity.js";
import { Operations } from "../model/operations.entity.js";
import { Transaction } from "../model/transaction.entity.js";
import { Workbench } from "../model/workbench.entity.js";
import { AppError } from "../utils/error.util.js";

export class WorkbenchService {
  private logger: Logger;
  transactionService: TransactionService;
  constructor(
    private readonly headerRepository: Repository<Header>,
    private readonly workbenchRepository: Repository<Workbench>,
    operationRepository: Repository<Operations>,
    otoRepository: Repository<OneTimeOperation>,
    transactionRepository: Repository<Transaction>,
    generateTransactionsVwRepository: Repository<GenerateTransactionsView>,
  ) {
    this.logger = AppLogger.getChildLogger("WorkbenchService");
    this.transactionService = new TransactionService(
      operationRepository,
      otoRepository,
      transactionRepository,
      generateTransactionsVwRepository,
    );
  }

  async createWorkbench(data) {
    try {
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
}
