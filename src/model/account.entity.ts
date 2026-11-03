import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  Unique,
} from "typeorm";

import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("accounts")
@Unique(["accountId"])
export class Account extends BaseEntity {
  @Column({ name: "account_id", length: 100 })
  accountId!: string;

  @Column({ name: "account_type", length: 10 })
  accountType!: string;

  @Column({ name: "account_subtype", length: 10 })
  accountSubtype!: string;

  @Column({ name: "account_name", length: 100 })
  accountName!: string;

  @Column({ name: "account_status", length: 1 })
  status!: string;

  @Column({
    name: "balance",
    type: "decimal",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  balance!: number;

  @Column({ name: "currency", length: 5 })
  currency!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
  user!: User;

  @RelationId((account: Account) => account.user)
  userId!: string;

  // @Column({ name: "user_id" })
  //   userId!: string;
}
