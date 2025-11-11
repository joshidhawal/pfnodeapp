import { BaseTypes } from "./base.js";
import { UserTypes } from "./user.js";

export interface AuthTypes extends BaseTypes {
  userId: string;
  password: string;
  isAdmin: string;
  user?: UserTypes;
}

export interface LoginObjectTypes {
  success: boolean;
  message: string;
  token?: any;
  refreshToken?: any;
}
