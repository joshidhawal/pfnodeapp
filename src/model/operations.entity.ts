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
  @Column({ name: "operation_id", length: 100 })
  operationId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
  user!: User;

  @RelationId((operation: Operations) => operation.user)
  userId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((operation: Operations) => operation.account)
  accountId!: string;

  @Column({ name: "operation_type", length: 10 })
  operationType!: string;

  @Column({ name: "data_type", length: 10 })
  dataType!: string;

  @Column("decimal", {
    name: "operating_amount",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  operatingAmount!: number;

  @Column("decimal", {
    name: "frequency",
    precision: 3,
    scale: 0,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseInt(value) : 0),
    },
  })
  frequency!: number;

  @Column({ name: "start_date", type: "timestamptz" })
  startDate!: Date;

  @Column({ name: "end_date", type: "timestamptz" })
  endDate!: Date;

  @Column({ name: "status", length: 1 })
  status!: string;
}
