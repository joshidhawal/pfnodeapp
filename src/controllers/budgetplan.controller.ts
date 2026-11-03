import { Request, Response } from "express";

import { AppDataSource } from "../data-source.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { BudgetPlanning } from "../model/budget-planning.js";
import { BudgetPlanningService } from "../services/budgetplanning.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { generateNewID } from "../utils/generateID.js";
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
    budgetId: generateNewID("BD"),
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userId,
    ...req.body,
  });

  const budget = await budgetPlanningService.createBudget(budgetData);
  sendResponseJSON(res, 201, budget);
});

export const getAllBudgetsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const budgetQueryData = validateRequest(
      getAllBudgetsForUserSchema,
      req.query,
    );

    const budgetData =
      await budgetPlanningService.getAllBudgetsForUser(budgetQueryData);
    sendResponseJSON(res, 200, budgetData);
  },
);

export const getBudgetById = catchAsync(async (req: Request, res: Response) => {
  const budgetQueryData = validateRequest(getBudgetByIdSchema, {
    userId: req.user?.userId,
    accountId: req.params["accountId"],
  });

  const budgetData = await budgetPlanningService.getBudgetById(budgetQueryData);

  sendResponseJSON(res, 200, budgetData);
});

export const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const budgetQueryData = validateRequest(updateBudgetSchema, {
    modifiedBy: req.user?.userId,
    ...req.body,
  });

  const budgetData = await budgetPlanningService.updateBudget(budgetQueryData);
  sendResponseJSON(res, 201, budgetData);
});

export const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const budgetData = validateRequest(deleteBudgetSchema, {
    modifiedBy: req.user?.userId,
    userId: req.user?.userId,
    ...req.body,
  });

  const budget = await budgetPlanningService.deleteBudget(budgetData);
  sendResponseJSON(res, 201, budget);
});

export const deleteAllBudgetsForUser = catchAsync(
  async (req: Request, res: Response) => {
    const budgetQueryData = validateRequest(deleteAllBudgetsForUserSchema, {
      modifiedBy: req.user?.userId,
      userId: req.user?.userId,
      ...req.body,
    });

    const budgetData =
      await budgetPlanningService.deleteAllBudgetsForUser(budgetQueryData);
    sendResponseJSON(res, 201, budgetData);
  },
);
