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

@Entity("one_time_operation")
@Unique(["operationId"])
export class OneTimeOperation extends BaseEntity {
  @Column({ name: "operation_id", length: 100 })
  operationId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
  user!: User;

  @RelationId((oto: OneTimeOperation) => oto.user)
  userId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((oto: OneTimeOperation) => oto.account)
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

  @Column({ name: "operation_date", type: "timestamptz" })
  operationDate!: Date;

  @Column({ name: "status", length: 1 })
  status!: string;
}
