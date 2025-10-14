import express from "express";
import {
  createUser,
  updateUserById,
  getAllUsers,
  getUserById,
  deleteUserById,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", requireAuth, createUser);
router.get("/", requireAuth, getAllUsers);
router.get("/:id", requireAuth, getUserById);
router.put("/:id", requireAuth, updateUserById);
router.delete("/:id", requireAuth, deleteUserById);

export default router;
