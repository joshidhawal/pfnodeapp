import { Request, Response } from "express";

import { AppDataSource } from "../data-source.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { BudgetPlanning } from "../model/budget-planning.js";
import { BudgetPlanningService } from "../services/budgetplanning.service.js";
import { BudgetTypes } from "../types/app/types.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  createBudgetSchema,
  deleteAllBudgetsForUserSchema,
  deleteBudgetSchema,
  getAllBudgetsForUserSchema,
  getBudgetByIdSchema,
  updateBudgetSchema,
} from "../validators/budgetplanning.schema.js";

const budgetPlanningRepository = AppDataSource.getRepository(BudgetPlanning);
const budgetPlanningService = new BudgetPlanningService(
  budgetPlanningRepository,
);

// const logger = AppLogger.getChildLogger("BudgetPlanningController");
// logger.info(`Create Account Request Data is : ${JSON.stringify(req.body)}`);

export const createBudget = catchAsync(async (req: Request, res: Response) => {
  const budgetData = validateRequest(createBudgetSchema, {
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userRole,
    ...req.body,
  });

  const budget = await budgetPlanningService.createBudget(budgetData);
  sendResponseJSON(res, 201, budget);
});

export const getAllBudgetsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const budgetData = validateRequest(getAllBudgetsForUserSchema);
    sendResponseJSON(res, 200, "");
  },
);

export const getBudgetById = catchAsync(async (req: Request, res: Response) => {
  const accountData = validateRequest(getBudgetByIdSchema, {
    userId: req.user?.userId,
    accountId: req.params["accountId"],
  });

  sendResponseJSON(res, 401, "");
});

export const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const budgetData = validateRequest(updateBudgetSchema, {
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userRole,
    ...req.body,
  });

  const budget: BudgetTypes =
    await bugetPlanningService.updateBudget(budgetData);
  sendResponseJSON(res, 201, budget);
});

export const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const budgetData = validateRequest(deleteBudgetSchema, {
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userRole,
    ...req.body,
  });

  const budget: BudgetTypes =
    await bugetPlanningService.deleteBudget(budgetData);
  sendResponseJSON(res, 201, budget);
});

export const deleteAllBudgetsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const budgetData = validateRequest(deleteAllBudgetsForUserSchema, {
      createdBy: req.user?.userId,
      modifiedBy: req.user?.userRole,
      ...req.body,
    });

    const budget: BudgetTypes =
      await bugetPlanningService.deleteAllBudgetsForUser(budgetData);
    sendResponseJSON(res, 201, budget);
  },
);
