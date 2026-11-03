import { Column, Entity, Unique } from "typeorm";

import { BaseEntity } from "./base.entity.js";

@Entity("account_group_info")
@Unique(["groupId"])
export class AccountGroupInfo extends BaseEntity {
  @Column({ name: "group_id", length: 100 })
  groupId!: string;

  @Column({ name: "group_name", length: 100 })
  groupName!: string;

  @Column({ name: "group_status", length: 1 })
  status!: string;
}
