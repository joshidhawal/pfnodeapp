import { Request, Response } from "express";
import { UserAuthEnums } from "../enums/enum.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { AuthService } from "../services/auth.service.js";
import { AuthTypes } from "../types/app/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponseJSON } from "../utils/send-res.util.js";
import {
  resetPasswordSchema,
  signupSchema,
} from "../validators/auth.schema.js";
import { createUserSchema } from "../validators/user.schema.js";
const authService = new AuthService();

export const login = catchAsync(async (req: Request, res: Response) => {
  const { userId, password }: Partial<AuthTypes> = req.body;
  const tokenObject = await authService.login({ userId, password });
  if (tokenObject.success) {
    res.cookie("refreshToken", tokenObject.refreshToken, {
      httpOnly: true,
      secure: true,
      // sameSite: "Strict",
      // domain: ".example.com", // available across all subdomains of example.com
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    delete tokenObject.refreshToken;
    sendResponseJSON(res, 201, tokenObject);
  } else {
    sendResponseJSON(res, 401, { message: tokenObject.message });
  }
});

export const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const tokenObject = await authService.refreshTokens(refreshToken);
  if (tokenObject.success) {
    res.cookie("refreshToken", tokenObject.refreshToken, {
      httpOnly: true,
      secure: true,
      // sameSite: "Strict",
      // domain: ".example.com", // available across all subdomains of example.com
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    delete tokenObject.refreshToken;
    sendResponseJSON(res, 201, tokenObject);
  } else {
    sendResponseJSON(res, 401, { message: tokenObject.message });
  }
});

export const signup = catchAsync(async (req: Request, res: Response) => {
  const createUserAuthData = validateRequest(signupSchema, {
    createdBy: req.body?.userId,
    modifiedBy: req.body?.userId,
    ...req.body,
  });

  const createUserData = validateRequest(createUserSchema, {
    createdBy: req.body?.userId,
    modifiedBy: req.body?.userId,
    ...req.body,
  });

  const userAuthStatus: string = await authService.signup(
    createUserAuthData,
    createUserData
  );
  sendResponseJSON(res, 201, { message: userAuthStatus });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const updateUserData = validateRequest(resetPasswordSchema, {
    modifiedBy: req.user?.userRole,
    isAdmin: UserAuthEnums.NOT_ADMIN,
    ...req.body,
  });

  const status: boolean = await authService.updateUserAuth(updateUserData);

  const resString = status
    ? "User security details are updated successfully"
    : "Failed to Update User Security";

  sendResponseJSON(res, 201, { resString });
});

export const changeAdminStatus = catchAsync(
  async (req: Request, res: Response) => {
    const createUserData = validateRequest(signupSchema, {
      createdBy: req.user?.userId,
      modifiedBy: req.user?.userRole,
      isAdmin: UserAuthEnums.NOT_ADMIN,
      ...req.body,
    });

    const status: boolean = await authService.updateUserAuth(createUserData);
    sendResponseJSON(res, 201, { status });
  }
);
