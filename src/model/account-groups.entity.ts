import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { AccountGroupInfo } from "./account-groups-info.entity.js";
import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";

@Entity("account_groups")
@Unique(["groupId", "accountId"])
export class AccountGroups extends BaseEntity {
  @ManyToOne(() => AccountGroupInfo, { nullable: false })
  @JoinColumn({ name: "group_id", referencedColumnName: "groupId" })
  accountGroup!: AccountGroupInfo;

  @Column({ name: "group_id" })
  groupId!: string;

  @Column({ name: "account_id" })
  accountId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;
}
