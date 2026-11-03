import express from "express";

import {
  createOperation,
  createTransaction,
  deleteOperation,
  deleteTransaction,
  getOperations,
  getTransactions,
  updateOperation,
  updateTransaction,
} from "../controllers/transaction.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

// router.post("/createOperation", requireAuth, createOperation);
router.post("/createOperation", createOperation);
router.get("/getOperations", requireAuth, getOperations);
router.get("/getOperationById", requireAuth, getOperations);
router.post("/updateOperation", requireAuth, updateOperation);
router.post("/deleteOperation", requireAuth, deleteOperation);

router.get("/createTransactions", requireAuth, createTransaction);
router.get("/getTransactions", requireAuth, getTransactions);
router.get("/updateTransactions", requireAuth, updateTransaction);
router.get("/deleteTransactions", requireAuth, deleteTransaction);

export default router;
