import z from "zod";

import { RecordStatus } from "../enums/enum.js";

const budgetPlanningMainSchema = z.object({
  budgetId: z.string().nonempty("Budget ID is required"),
  userId: z.string().nonempty("User ID is required"),
  accountId: z.string().nonempty("Account ID is required"),
  startDate: z.date("Start Date is required."),
  endDate: z.date("End Date is required."),
  amount: z.coerce
    .number()
    .refine((val) => Number.isFinite(val), {
      message: "Invalid number",
    })
    .refine((val) => Number(val.toFixed(4)) === val, {
      message: "Max 4 decimal places allowed",
    })
    .default(0),
  createdBy: z.string().nonempty("Created By is required"),
  modifiedBy: z.string().nonempty("Modified By is required"),
  status: z.string().default(RecordStatus.NEW),
});

export const createBudgetSchema = budgetPlanningMainSchema.pick({
  budgetId: true,
  userId: true,
  accountId: true,
  startDate: true,
  endDate: true,
  amount: true,
  createdBy: true,
  modifiedBy: true,
  status: true,
});

export const getBudgetByIdSchema = budgetPlanningMainSchema.pick({
  userId: true,
  accountId: true,
  budgetId: true,
});

export const getAllBudgetsForUserSchema = budgetPlanningMainSchema
  .pick({
    userId: true,
    accountId: true,
  })
  .partial({
    accountId: true,
  });

export const updateBudgetSchema = budgetPlanningMainSchema.pick({
  budgetId: true,
  userId: true,
  accountId: true,
  startDate: true,
  endDate: true,
  amount: true,
  createdBy: true,
  modifiedBy: true,
  status: true,
});

export const deleteBudgetSchema = budgetPlanningMainSchema.pick({
  budgetId: true,
  userId: true,
  accountId: true,
});

export const deleteAllBudgetsForUserSchema = budgetPlanningMainSchema.pick({
  userId: true,
});
