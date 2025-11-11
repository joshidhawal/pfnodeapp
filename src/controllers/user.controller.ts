import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { UserEnums } from "../enums/enum.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { User } from "../model/user.entity.js";
import { AppLogger } from "../services/logger.service.js";
import { UserService } from "../services/user.service.js";
import { UserTypes } from "../types/app/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  createUserSchema,
  deleteUserByIdSchema,
  getUserByIdSchema,
  updateUserByIdSchema,
} from "../validators/user.schema.js";

const userService = new UserService();
const logger = AppLogger.getChildLogger("UserController");

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const createUserData = validateRequest(createUserSchema, {
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userId,
    status: UserEnums.USER_NEW,
    ...req.body,
  });

  const user: UserTypes = await userService.createUser(createUserData);
  sendResponseJSON(res, 201, user);
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = validateRequest(getUserByIdSchema, req.params);
  const user = await userService.getUserById(userId);
  sendResponseJSON(res, 200, user);
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const userArray = await userService.getAllUsers();
  sendResponseJSON(res, 200, userArray);
});

export const updateUserById = catchAsync(
  async (req: Request, res: Response) => {
    const updateUserData = validateRequest(updateUserByIdSchema, {
      modifiedBy: req.user.userId,
      ...req.body,
    });
    const user = await userService.updateUserById(updateUserData);
    sendResponseJSON(res, 200, user);
  }
);

export const deleteUserById = catchAsync(
  async (req: Request, res: Response) => {
    const userData = validateRequest(deleteUserByIdSchema, {
      modifiedby: req.user.userId,
      ...req.query,
    });
    const user = await userService.deleteUserById(userData);
    res.status(201).json(user);
  }
);
