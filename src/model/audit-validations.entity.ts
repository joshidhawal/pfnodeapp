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
  @Column({ length: 100 })
  auditId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId", referencedColumnName: "userId" })
  user!: User;

  @RelationId((audit: AuditValidations) => audit.user)
  userId!: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: "accountId", referencedColumnName: "accountId" })
  account!: Account;

  @RelationId((audit: AuditValidations) => audit.account)
  accountId!: string;

  @Column("decimal", { precision: 1, scale: 0 })
  validationType!: number;

  @Column({ default: false })
  isLax!: boolean;

  @Column("decimal", { precision: 20, scale: 4 })
  amount!: number;

  @Column({ length: 10 })
  dataType!: string;
}
