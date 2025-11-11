import express from "express";
import { login, refreshToken, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshtoken", refreshToken);
// router.post("/resetpassword", resetPassword);

export default router;
