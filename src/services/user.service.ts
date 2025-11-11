import { Logger } from "pino";
import { Not, Repository } from "typeorm";
import { UserEnums } from "../enums/enum.js";
import { AppError } from "../utils/error.util.js";
import { User } from "../model/user.entity.js";
import { UserTypes } from "../types/app/user.js";
import { AppLogger } from "./logger.service.js";
import { AppDataSource } from "../data-source.js";

export class UserService {
  private logger: Logger;
  private userRepository: Repository<User>;
  constructor() {
    this.logger = AppLogger.getChildLogger("UserService");
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(data: Partial<UserTypes>): Promise<UserTypes> {
    try {
      const newUser = this.userRepository.create(data);
      return await this.userRepository.save(newUser);
    } catch (error: any) {
      switch (error.code) {
        case "23505":
          throw new AppError("User already exists", 409, error);
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async getUserById(userId: string): Promise<UserTypes> {
    try {
      return await this.userRepository.findOneBy({
        userId,
        status: Not(UserEnums.USER_DELETED),
      });
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async getAllUsers(): Promise<UserTypes[]> {
    try {
      return await this.userRepository.find({
        where: { status: Not(UserEnums.USER_DELETED) },
      });
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async updateUserById(data: Partial<UserTypes>): Promise<UserTypes> {
    try {
      const user = await this.getUserById(data.userId);
      if (!user) return null;

      // Updating User Status to Modified if New, it won't change D - Deleted Status
      user.status == UserEnums.USER_NEW
        ? (user.status = UserEnums.USER_MODIFIED)
        : user.status;

      const updatedUserData = { ...user, ...data };

      return await this.userRepository.save(updatedUserData);
    } catch (error: any) {
      switch (error.code) {
        default:
          throw new AppError("Internal Server Error", 500, error);
      }
    }
  }

  async deleteUserById(userData: Partial<UserTypes>): Promise<string> {
    const user = await this.getUserById(userData.userId);
    if (!user) return null;
    user.status = UserEnums.USER_DELETED;
    const result = await this.updateUserById(user);
    if (!result) return null;
    return `User : ${userData.userId} Successfully Deleted`;
  }
}
