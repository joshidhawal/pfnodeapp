import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
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
  userId!: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId", referencedColumnName: "accountId" })
  accountId!: string;

  @Column({ length: 10 })
  operationType!: string;

  @Column({ length: 10 })
  dataType!: string;

  @Column("decimal", { precision: 20, scale: 4 })
  operatingAmount!: Number;

  @Column("decimal", { precision: 3, scale: 0 })
  frequency!: Number;

  @Column({ type: "timestamptz" })
  startDate!: Date;

  @Column({ type: "timestamptz" })
  endDate!: Date;

  @Column({ length: 1 })
  status!: string;
}
