import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./account.entity.js";
import { User } from "./user.entity.js";

@Entity("transaction")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
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
