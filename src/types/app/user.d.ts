import { BaseTypes } from "./base.js";

export interface UserTypes extends BaseTypes {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateCreated: Date;
  dateModified: Date;
  status: string;
  userSecurity?: UserSecTypes;
}

export type UserLoginType = Pick<UserTypes, "userId"> &
  Pick<AuthTypes, "password">;
