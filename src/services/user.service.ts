import { Logger } from "pino";
import { Not, Repository, DeepPartial, QueryFailedError } from "typeorm";

import { AppDataSource } from "../data-source.js";
import { AppLogger } from "./logger.service.js";
import { RecordStatus } from "../enums/enum.js";
import { User } from "../model/user.entity.js";
import {
  deleteUserByIdInput,
  getUserByIdInput,
  updateUserByIdInput,
  UserTypes,
} from "../types/app/types.js";
import { AppError } from "../utils/error.util.js";

export class UserService {
  private logger: Logger;
  private userRepository: Repository<User>;
  constructor() {
    this.logger = AppLogger.getChildLogger("UserService");
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Had to add mapping since TS was not able to Map it to a single entity output object
  // and was mapping it to the array return type object. Hence this globally accepted workaround.
  // This is purely to satisfy TS no login involved.
  // -----------
  // this mapping is needed or else manually you've to map just to satisfy TS since typeorm doesn't work well
  // and this inability to infer is stupid. Hence either use DeepPartial or Create a Mapper in this way
  // so as to satisfy the TS or another way is to hardcode directly object attributes like userId: data.userId
  // so TS and TypeORM can understand that you're sending the same shit.
  // Removing this wrapper and using DeepPartial as type directly since it should be working this way itself.
  // This thing is not needed for updating since for updates we fetch the object directly and modify it so TS
  // understands the types and doesn't mess with our head here.
  // Keeping this function below here for future reminder and reference so I don't forget this.

  // private toUserEntityMapper(data: createUserInput): DeepPartial<User> {
  //   return {
  //     ...data,
  //   };
  // }

  async createUser(data: DeepPartial<UserTypes>): Promise<User> {
    try {
      // const entityData = this.toUserEntityMapper(data);
      const newUser = this.userRepository.create(data);
      this.logger.info("Created New User");
      return await this.userRepository.save(newUser);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverErrorCode = error.driverError as string;
        if (driverErrorCode === "23505")
          throw new AppError("Account already exists", 409, error);
      }
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getUserById(userId: getUserByIdInput): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        userId,
        status: Not(RecordStatus.DELETED),
      });
      if (!user) {
        throw new AppError("User not found", 404);
      }
      return user;
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        where: { status: Not(RecordStatus.DELETED) },
      });
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async updateUserById(data: updateUserByIdInput): Promise<User> {
    try {
      const user = await this.getUserById(data.userId);

      // Updating User Status to Modified if New, it won't change D - Deleted Status
      user.status == RecordStatus.NEW
        ? (user.status = RecordStatus.MODIFIED)
        : user.status;

      const updatedUserData = { ...user, ...data };
      this.logger.info("Updating the User");
      return await this.userRepository.save(updatedUserData);
    } catch (error: unknown) {
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }

  async deleteUserById(userData: deleteUserByIdInput): Promise<string> {
    try {
      const user = await this.getUserById(userData.userId);
      user.status = RecordStatus.DELETED;
      await this.userRepository.save(user);
      this.logger.info("Deleted User Sucessfully");
      return `User : ${userData.userId} Successfully Deleted`;
    } catch (error: unknown) {
      this.logger.info(`Failed to Delete the User : ${userData.userId}`);
      throw new AppError(
        "Internal Server Error",
        500,
        error instanceof Error ? error : undefined,
      );
    }
  }
}
