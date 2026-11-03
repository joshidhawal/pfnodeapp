import {
  Entity,
  Unique,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";

import { AccountGroupInfo } from "./account-groups-info.entity.js";
import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("header")
@Unique(["wbId"])
export class Header extends BaseEntity {
  @Column({ name: "wb_id", length: 100 })
  wbId!: string;

  @Column({ name: "start_date", type: "timestamptz" })
  startDate!: Date;

  @Column({ name: "end_date", type: "timestamptz" })
  endDate!: Date;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
  user!: User;

  @Column({ name: "account_id" })
  accountId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;

  @Column({ name: "group_id" })
  groupId!: string;

  @OneToOne(() => AccountGroupInfo, { nullable: false })
  @JoinColumn({ name: "group_id", referencedColumnName: "groupId" })
  group!: AccountGroupInfo;

  @Column({ name: "wb_status", length: 10 })
  operationType!: string;
}
