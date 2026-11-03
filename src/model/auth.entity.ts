import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";
import { UserAuthEnums } from "../enums/enum.js";

@Entity("userauth")
export class UserAuth extends BaseEntity {
  @Column({ name: "user_id" })
  userId!: string;

  @OneToOne(() => User, {
    nullable: false,
    cascade: ["insert"],
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "userId",
  })
  user!: User;

  // @RelationId((auth: UserAuth) => auth.user)
  // userId!: string;

  @Column({ name: "password", length: 100 })
  password!: string;

  @Column({ name: "is_admin", length: 1, default: UserAuthEnums.NOT_ADMIN })
  isAdmin!: string;
}
