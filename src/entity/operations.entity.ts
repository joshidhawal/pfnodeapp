import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("operations")
export class Operations extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  operationId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  userId!: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId" })
  accountId!: string;

  @Column({ length: 10 })
  operationType!: string;

  @Column({ length: 10 })
  dataType!: string;

  @Column("decimal", { precision: 20, scale: 4 })
  amount!: Number;

  @Column("decimal", { precision: 3, scale: 0 })
  frequency!: Number;

  @Column({ type: "timestamptz" })
  startDate!: Date;

  @UpdateDateColumn()
  endDate!: Date;

  @Column({ length: 1 })
  status!: string;
}
