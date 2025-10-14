import { AppDataSource } from "../data-source.js";
import { Request, Response } from "express";
import { User } from "../model/user.entity.js";
import { UserService } from "../services/user.service.js";
import { sendResponseJSON } from "../utils/createResponseJSON.js";
import { catchAsync } from "../utils/catchAsync.js";

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const createUserData = {
    createdBy: req.user?.userId,
    modifiedBy: req.user?.userRole,
    ...req.body,
  };
  const user = await userService.createUser(createUserData);
  sendResponseJSON(res, 201, user);
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.body);
  sendResponseJSON(res, 200, user);
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const userArray = await userService.getAllUsers();
  sendResponseJSON(res, 200, userArray);
});

export const updateUserById = catchAsync(
  async (req: Request, res: Response) => {
    const user = await userService.updateUserById(req.body);
    sendResponseJSON(res, 200, user);
  }
);

export const deleteUserById = catchAsync(
  async (req: Request, res: Response) => {
    const user = await userService.deleteUserById(req.body);
    res.status(201).json(user);
  }
);
