import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { User } from "./user.entity.js";
import { UserAuthEnums } from "../enums/enum.js";

@Entity("userauth")
export class UserAuth extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: "user", referencedColumnName: "userId" })
  user!: User;

  @RelationId((auth: UserAuth) => auth.user)
  userId!: string;

  @Column({ length: 100 })
  password!: string;

  @Column({ length: 1, default: UserAuthEnums.NOT_ADMIN })
  isAdmin!: string;
}
