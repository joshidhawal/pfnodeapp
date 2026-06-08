import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  Unique,
} from "typeorm";

import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("operations")
@Unique(["operationId"])
export class Operations extends BaseEntity {
  @Column({ length: 100 })
  operationId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId", referencedColumnName: "userId" })
  user!: User;

  @RelationId((operation: Operations) => operation.user)
  userId!: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((operation: Operations) => operation.account)
  accountId!: string;

  @Column({ length: 10 })
  operationType!: string;

  @Column({ length: 10 })
  dataType!: string;

  @Column("decimal", { precision: 20, scale: 4 })
  operatingAmount!: number;

  @Column("decimal", { precision: 3, scale: 0 })
  frequency!: number;

  @Column({ type: "timestamptz" })
  startDate!: Date;

  @Column({ type: "timestamptz" })
  endDate!: Date;

  @Column({ length: 1 })
  status!: string;
}
