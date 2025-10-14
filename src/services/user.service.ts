import { AppError } from "../middlewares/error.middleware.js";
import { User } from "../model/user.entity.js";
import { Repository } from "typeorm";
import { UserTypes } from "../types/app/user.js";

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async createUser(data: Partial<UserTypes>): Promise<UserTypes> {
    try {
      const newUser = this.userRepository.create(data);
      console.table(newUser);
      return await this.userRepository.save(newUser);
    } catch (error: any) {
      // PostgreSQL error code for "duplicate key"
      if (error.code === "23505") {
        throw new AppError("User already exists", 409); // 409 Conflict
      }

      // Fallback for other DB errors
      throw new AppError("Failed to create user", 500);
    }
  }

  async getUserById(userId: string): Promise<UserTypes> {
    return await this.userRepository.findOneBy({ userId });
  }

  async getAllUsers(): Promise<UserTypes[]> {
    return await this.userRepository.find();
  }

  async updateUserById(data: Partial<UserTypes>): Promise<UserTypes> {
    const user = await this.getUserById(data.userId);
    if (!user) return null;

    const updatedUser = Object.assign(user, data);
    return await this.userRepository.save(updatedUser);
  }

  async deleteUserById(userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const result = await this.userRepository.delete(userId);
    return result.affected ? "User deleted" : "User not found";
  }
}
