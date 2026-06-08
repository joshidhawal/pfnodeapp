import express from "express";

import {
  changeAdminStatus,
  login,
  refreshToken,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshtoken", refreshToken);
router.post("/resetpassword", resetPassword);
router.post("/changeAdminStatus", requireAuth, changeAdminStatus);

export default router;
