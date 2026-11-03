import { Check, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

import { Account } from "./account.entity.js";
import { BaseEntity } from "./base.entity.js";
import { OneTimeOperation } from "./one-time-operation.entity.js";
import { Operations } from "./operations.entity.js";

@Entity("workbench")
// 1. Row-level bouncer: Ensures either userId or accountId is filled, never both or neither
@Check(
  `"operation_id" IS NOT NULL AND "otoperation_id" IS NULL OR "operation_id" IS NULL AND "otoperation_id" IS NOT NULL`,
)
// 2. Table-level ledger check (Operation transactions): Prevents duplicates when linked to a operation
@Index(
  "uq_wb_account_op_date",
  ["wbId", "accountId", "operationId", "transactionDate"],
  {
    unique: true,
    where: "operation_id IS NOT NULL",
  },
)
// 3. Table-level ledger check (OneTimeOperation transactions): Prevents duplicates when linked to a otoperation
@Index(
  "uq_wb_account_otop_date",
  ["wbId", "accountId", "otoperationId", "transactionDate"],
  {
    unique: true,
    where: "otoperation_id IS NOT NULL",
  },
)
export class Workbench extends BaseEntity {
  @Column({ name: "wb_id", length: 100 })
  wbId!: string;

  @Column({ name: "transaction_date", type: "timestamptz" })
  transactionDate!: Date;

  @Column({ name: "operation_id", nullable: true })
  operationId!: string | null;

  @ManyToOne(() => Operations)
  @JoinColumn({ name: "operation_id", referencedColumnName: "operation_id" })
  operation!: Operations | null;

  @Column({ name: "otoperation_id", nullable: true })
  otoperationId!: string | null;

  @ManyToOne(() => OneTimeOperation)
  @JoinColumn({
    name: "otoperation_id",
    referencedColumnName: "otoperation_id",
  })
  otoperation!: OneTimeOperation | null;

  @Column({ name: "account_id" })
  accountId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;

  @Column("decimal", {
    name: "initial_amt",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  initialAmount!: number;

  @Column({ name: "operation_type", length: 10 })
  operationType!: string;

  @Column({ name: "status", length: 1 })
  status!: string;

  @Column("decimal", {
    name: "operating_amt",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  operatingAmount!: number;

  @Column("decimal", {
    name: "end_amt",
    precision: 20,
    scale: 4,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  endAmount!: number;

  @Column({ name: "transaction_type", length: 10 })
  transactionType!: string;
}
