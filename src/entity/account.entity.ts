import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity.js";

@Entity("accounts")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
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
