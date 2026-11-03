import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("transaction")
@Unique(["transactionId"])
export class Transaction extends BaseEntity {
  @Column({ name: "transaction_id", length: 100 })
  transactionId!: string;

  @Column({ name: "transaction_date", type: "timestamptz" })
  transactionDate!: Date;

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

  @Column("decimal", {
    name: "initial_amt",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  initialAmount!: number;

  @Column({ name: "operation_type", length: 10 })
  operationType!: string;

  @Column({ name: "status", length: 1 })
  status!: string;

  @Column("decimal", {
    name: "operating_amt",
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
    name: "end_amt",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  endAmount!: number;

  @Column({ name: "transaction_type", length: 10 })
  transactionType!: string;
}
