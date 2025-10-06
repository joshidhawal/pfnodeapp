import { Column, Entity, Unique } from "typeorm";
import { BaseEntity } from "./base.entity.js";

@Entity("accounts")
@Unique(["accountId"])
export class Account extends BaseEntity {
  @Column({ length: 100 })
  accountId!: string;

  @Column({ length: 10 })
  accountType!: string;

  @Column({ length: 10 })
  accountSubtype!: string;

  @Column({ length: 100 })
  accountName!: string;

  @Column({ length: 1 })
  status!: string;

  @Column("decimal", { precision: 20, scale: 4 })
  balance!: number;
}
