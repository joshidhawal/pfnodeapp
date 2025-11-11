import express from "express";
import {
  createAccount,
  deleteAccountById,
  getAccountById,
  getAllAccounts,
  updateAccountBalance,
  updateAccountById,
} from "../controllers/account.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", requireAuth, createAccount);
router.get("/", requireAuth, getAllAccounts);
router.get("/:accountId", requireAuth, getAccountById);
router.put("/", requireAuth, updateAccountById);
router.delete("/", requireAuth, deleteAccountById);
router.patch("/", requireAuth, updateAccountBalance);

export default router;
