import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/env.js";
import { UserService } from "./user.service.js";
import { Logger } from "pino";
import {
  EntityNotFoundError,
  Not,
  QueryFailedError,
  Repository,
} from "typeorm";
import { AppDataSource } from "../data-source.js";
import { AppError } from "../utils/error.util.js";
import { AppLogger } from "./logger.service.js";
import { UserAuth } from "../model/auth.entity.js";
import { AuthTypes, LoginObjectTypes } from "../types/app/auth.js";
import { UserLoginType, UserTypes } from "../types/app/user.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import { configTypes } from "../types/app/env.js";
import { error } from "console";
import { AccountEnums } from "../enums/enum.js";

export class AuthService {
  userService: UserService;
  logger: Logger;
  authRepository: Repository<UserAuth>;

  constructor() {
    this.logger = AppLogger.getChildLogger("AuthService");
    this.userService = new UserService();
    this.authRepository = AppDataSource.getRepository(UserAuth);
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
      throw new AppError("Invalid token");
    }
  }

  async generateToken(payload, signingOptions) {
    this.logger.info(`generate token payload is ${JSON.stringify(payload)}`);
    const token = jwt.sign(payload, config.JWT_SECRET, signingOptions);
    return token;
  }

  async refreshTokens(payload): Promise<LoginObjectTypes> {
    try {
      this.logger.info(payload);
      this.logger.info(config);
      const payloadVerified = this.verifyToken(payload);
      this.logger.info(payloadVerified);
      // @ts-ignore
      const userSec = await this.getUserSec(payloadVerified.userId);
      this.logger.info(userSec);
      const token = await this.generateToken(
        { userId: userSec.userId },
        {
          expiresIn: config.JWT_EXPIRES_IN,
        }
      );
      const refreshToken = await this.generateToken(
        { userId: userSec.userId },
        {
          expiresIn: config.REFRESH_JWT_EXPIRES_IN,
        }
      );
      return {
        success: true,
        message: "New Token Successfully generated",
        token,
        refreshToken,
      };
    } catch (error) {
      if (error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500, error);
      }
    }
  }
  async signup(
    newUserAuthData: Partial<AuthTypes>,
    newUserData: Partial<UserTypes>
  ): Promise<string> {
    try {
      // Creating User Record
      const newUser = await this.userService.createUser(newUserData);

      // Creating User Authentication Record
      newUserAuthData.password = await hashPassword(newUserAuthData.password);
      const newUserAuthRecord = this.authRepository.create(newUserAuthData);
      const newUserAuth = await this.authRepository.save(newUserAuthRecord);
      return `User ${newUser.firstName} ${newUser.lastName} is registered successfully`;
    } catch (error: any) {
      if (error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async login(loginDetails: Partial<AuthTypes>): Promise<LoginObjectTypes> {
    try {
      const newUserSec = await this.getUserSec(loginDetails.userId);
      this.logger.info("Getting user information");
      this.logger.info(newUserSec);
      const isVerified = await comparePassword(
        newUserSec.password,
        loginDetails.password
      );

      if (isVerified) {
        const token = await this.generateToken(
          { userId: loginDetails.userId },
          {
            expiresIn: config.JWT_EXPIRES_IN,
          }
        );
        const refreshToken = await this.generateToken(
          { userId: loginDetails.userId },
          {
            expiresIn: config.REFRESH_JWT_EXPIRES_IN,
          }
        );
        return { success: true, message: "Login Success", token, refreshToken };
      }

      return { success: false, message: "Login Failed" };
    } catch (error: any) {
      if (error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async getUserSec(userId: string): Promise<AuthTypes> {
    try {
      const newUserSec = await this.authRepository.findOneOrFail({
        where: { user: { userId, status: Not(AccountEnums.ACCOUNT_DELETED) } },
        relations: ["user"],
      });
      return newUserSec;
    } catch (error: any) {
      if (
        error instanceof EntityNotFoundError ||
        error instanceof QueryFailedError
      ) {
        throw new AppError("User Not Found", 404, error);
      } else if (error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async updateUserAuth(data: Partial<AuthTypes>): Promise<boolean> {
    try {
      const userSecData = this.getUserSec(data.userId);
      const updateUserSecData = this.authRepository.create({
        ...userSecData,
        ...data,
      });
      const updatedUserSec = await this.authRepository.save(updateUserSecData);
      return true;
    } catch (error: any) {
      if (error.message) {
        throw error;
      } else {
        throw new AppError("Internal Server Error", 500, error);
      }
    }
  }
}
