import express from "express";

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

router.post("/", requireAuth, createAccountGroup);
router.get("/", requireAuth, getAllAcGroupInfo);
router.get("/grp/", requireAuth, getAccountGroup);
router.get("/info/", requireAuth, getAcGroupInfo);
router.put("/grp/", requireAuth, updateAccountGroup);
router.put("/info/", requireAuth, updateAcGroupInfo);
router.delete("/grp/", requireAuth, deleteAccountGroup);
router.delete("/info/", requireAuth, deleteAcGroupInfo);

export default router;
