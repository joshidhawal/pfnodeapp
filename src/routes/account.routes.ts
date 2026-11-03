import express from "express";

import {
  createAccount,
  deleteAccountById,
  getAccountById,
  getAllAccounts,
  updateAccountBalance,
  updateAccountById,
} from "../controllers/account.controller.js";
import {
  createAccountGroup,
  deleteAccountGroup,
  deleteAcGroupInfo,
  getAccountGroup,
  getAcGroupInfo,
  getAllAcGroupInfo,
  updateAccountGroup,
  updateAcGroupInfo,
} from "../controllers/accountGroup.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", requireAuth, createAccount);
router.get("/", requireAuth, getAllAccounts);
router.get("/:accountId", requireAuth, getAccountById);
router.put("/", requireAuth, updateAccountById);
router.delete("/", requireAuth, deleteAccountById);
router.patch("/", requireAuth, updateAccountBalance);

router.post("/grp/create", requireAuth, createAccountGroup);
router.get("/grp/getAll", requireAuth, getAllAcGroupInfo);
router.get("/grp", requireAuth, getAccountGroup);
router.get("/info", requireAuth, getAcGroupInfo);
router.put("/grp", requireAuth, updateAccountGroup);
router.put("/info", requireAuth, updateAcGroupInfo);
router.delete("/grp", requireAuth, deleteAccountGroup);
router.delete("/info", requireAuth, deleteAcGroupInfo);

export default router;
