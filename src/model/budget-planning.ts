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

@Entity("budgetplanning")
@Unique(["budgetId"])
export class BudgetPlanning extends BaseEntity {
  @Column({ name: "budget_id", length: 100 })
  budgetId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
  user!: User;

  @RelationId((budget: BudgetPlanning) => budget.user)
  userId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((budget: BudgetPlanning) => budget.account)
  accountId!: string;

  @Column({ name: "start_date", type: "timestamptz" })
  startDate!: Date;

  @Column({ name: "end_date", type: "timestamptz" })
  endDate!: Date;

  @Column("decimal", {
    name: "amount",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  amount!: number;

  @Column({ name: "status", length: 1 })
  status!: string;
}
