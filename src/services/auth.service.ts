import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Logger } from "pino";
import {
  EntityNotFoundError,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";

import config from "../config/env.js";
import { AppDataSource } from "../data-source.js";
import { AppLogger } from "./logger.service.js";
import { UserService } from "./user.service.js";
import { RecordStatus } from "../enums/enum.js";
import { UserAuth } from "../model/auth.entity.js";
import {
  AuthTypes,
  LoginObjectTypes,
  UserLoginType,
} from "../types/app/types.js";
import { UserTypes } from "../types/app/types.js";
import { AppError } from "../utils/error.util.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";

export class AuthService {
  userService: UserService;
  logger: Logger;
  authRepository: Repository<UserAuth>;

  constructor() {
    this.logger = AppLogger.getChildLogger("AuthService");
    this.userService = new UserService();
    this.authRepository = AppDataSource.getRepository(UserAuth);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    } catch (err) {
      this.logger.error(err);
      throw new AppError("Invalid token");
    }
  }

  async generateToken(payload: object, signingOptions: SignOptions) {
    this.logger.info(`generate token payload is ${JSON.stringify(payload)}`);
    const token = jwt.sign(payload, config.JWT_SECRET, signingOptions);
    return token;
  }

  async refreshTokens(payload: string): Promise<LoginObjectTypes> {
    try {
      this.logger.info(payload);
      this.logger.info(config);
      const payloadVerified = this.verifyToken(payload);
      this.logger.info(payloadVerified);
      const userSec = await this.getUserSec(payloadVerified["userId"]);
      this.logger.info(userSec);
      const signOptions: SignOptions = {};
      if (config.JWT_EXPIRES_IN !== undefined) {
        signOptions.expiresIn = config.JWT_EXPIRES_IN;
      }
      const token = await this.generateToken(
        { userId: userSec.userId },
        signOptions,
      );
      const refreshToken = await this.generateToken(
        { userId: userSec.userId },
        signOptions,
      );
      return {
        success: true,
        message: "New Token Successfully generated",
        token,
        refreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }
  async signup(
    newUserAuthData: UserLoginType,
    newUserData: Partial<UserTypes>,
  ): Promise<string> {
    try {
      // Creating User Record
      const newUser = await this.userService.createUser(newUserData);

      // Creating User Authentication Record
      newUserAuthData.password = await hashPassword(newUserAuthData.password);
      const newUserAuthRecord = this.authRepository.create({
        ...newUserAuthData,
        user: newUser,
      });
      const newUserAuth = await this.authRepository.save(newUserAuthRecord);
      this.logger.info(newUserAuth);
      return `User ${newUser.firstName} ${newUser.lastName} is registered successfully`;
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async login(loginDetails: UserLoginType): Promise<LoginObjectTypes> {
    try {
      const newUserSec = await this.getUserSec(loginDetails.userId);
      this.logger.info("Getting user information");
      this.logger.info(newUserSec);
      const isVerified = await comparePassword(
        newUserSec.password,
        loginDetails.password,
      );

      if (isVerified) {
        const token = await this.generateToken(
          { userId: loginDetails.userId },
          {
            expiresIn: config.JWT_EXPIRES_IN,
          },
        );
        const refreshToken = await this.generateToken(
          { userId: loginDetails.userId },
          {
            expiresIn: config.REFRESH_JWT_EXPIRES_IN,
          },
        );
        return { success: true, message: "Login Success", token, refreshToken };
      }

      return { success: false, message: "Login Failed" };
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async getUserSec(userId: string): Promise<AuthTypes> {
    try {
      const newUserSec = await this.authRepository.findOne({
        where: { user: { userId, status: Not(RecordStatus.DELETED) } },
        relations: ["user"],
      });

      if (!newUserSec) {
        throw new AppError("User not found", 404);
      }

      return newUserSec;
    } catch (error: unknown) {
      if (
        error instanceof EntityNotFoundError ||
        error instanceof QueryFailedError
      ) {
        throw new AppError("User Not Found", 404, error);
      } else if (error instanceof Error && error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }

  async updateUserAuth(data: UserLoginType): Promise<boolean> {
    try {
      const userSecData = await this.getUserSec(data.userId);

      //this comparison is for password since reset password also uses this method.
      if (userSecData.password !== data.password) {
        userSecData.password = await hashPassword(userSecData.password);
      }

      const updateUserSecData = this.authRepository.create({
        ...userSecData,
        ...data,
      });

      const updatedUserSec = await this.authRepository.save(updateUserSecData);
      this.logger.info(updatedUserSec);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    }
  }
}
