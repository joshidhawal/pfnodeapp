import { BaseTypes } from "./base.js";

export interface AccountTypes extends BaseTypes {
  accountId: string;
  accountType: string;
  accountSubtype: string;
  accountName: string;
  status: string;
  balance: number;
  userId: string;
  currency: string;
}
