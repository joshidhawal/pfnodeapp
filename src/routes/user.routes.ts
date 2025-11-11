import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", requireAuth, createUser);
router.get("/", requireAuth, getAllUsers);
router.get("/:userId", requireAuth, getUserById);
router.put("/", requireAuth, updateUserById);
router.delete("/", requireAuth, deleteUserById);

export default router;
