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

@Entity("auditvalidations")
@Unique(["auditId"])
export class AuditValidations extends BaseEntity {
  @Column({ name: "audit_id", length: 100 })
  auditId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id", referencedColumnName: "userId" })
  user!: User;

  @RelationId((audit: AuditValidations) => audit.user)
  userId!: string;

  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: "account_id", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((audit: AuditValidations) => audit.account)
  accountId!: string;

  @Column("decimal", {
    name: "validation_type",
    precision: 1,
    scale: 0,
    transformer: {
      // What goes to the DB (keep as is or stringify)
      to: (value: number) => value,
      // What comes out of the DB (automatically parse into a number)
      from: (value: string) => (value ? parseFloat(value) : 0),
    },
  })
  validationType!: number;

  @Column({ name: "is_lax", default: false })
  isLax!: boolean;

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

  @Column({ name: "data_type", length: 10 })
  dataType!: string;
}
