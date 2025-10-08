import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";

@Entity("one_time_operation")
@Unique(["operationId"])
export class OneTimeOperation extends BaseEntity {
  @Column({ length: 100 })
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
  operatingAmount!: number;
}
