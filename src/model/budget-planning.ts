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
  @Column({ length: 100 })
  budgetId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId", referencedColumnName: "userId" })
  user!: User;

  @RelationId((budget: BudgetPlanning) => budget.user)
  userId!: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((budget: BudgetPlanning) => budget.account)
  accountId!: string;

  @Column({ type: "timestamptz" })
  startDate!: Date;

  @Column({ type: "timestamptz" })
  endDate!: Date;

  @Column("decimal", { precision: 20, scale: 4 })
  amount!: number;

  @Column({ length: 1 })
  status!: string;
}
