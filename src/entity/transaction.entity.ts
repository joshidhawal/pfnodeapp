import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("transaction")
@Unique(["transactionId"])
export class Transaction extends BaseEntity {
  @Column({ length: 100 })
  transactionId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  userId!: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId" })
  accountId!: string;

  @Column("decimal", { precision: 20, scale: 4 })
  initialAmount!: number;

  @Column({ length: 10 })
  operationType!: string;

  @Column("decimal", { precision: 20, scale: 4 })
  operatingAmount!: number;

  @Column("decimal", { precision: 20, scale: 4 })
  endAmount!: number;

  @Column({ length: 10 })
  transactionType!: string;
}
