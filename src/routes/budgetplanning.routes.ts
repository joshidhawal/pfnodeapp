import express from "express";

import {
  createBudget,
  getBudgetById,
  getAllBudgetsForUser,
  updateBudget,
  deleteBudget,
  deleteAllBudgetsForUser,
} from "../controllers/budgetplan.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", requireAuth, createBudget);
router.get("/", requireAuth, getBudgetById);
router.get("/:UserId", requireAuth, getAllBudgetsForUser);
router.put("/", requireAuth, updateBudget);
router.delete("/", requireAuth, deleteBudget);
router.delete("/:UserId", requireAuth, deleteAllBudgetsForUser);

export default router;
