import { Column, Entity, Unique } from "typeorm";

import { BaseEntity } from "./base.entity.js";

@Entity("users")
@Unique(["userId"])
export class User extends BaseEntity {
  @Column({ name: "user_id", length: 100 })
  userId!: string;

  @Column({ name: "first_name", length: 100 })
  firstName!: string;

  @Column({ name: "last_name", length: 100 })
  lastName!: string;

  @Column({ name: "email", length: 100 })
  email!: string;

  @Column({ name: "status", length: 1 })
  status!: string;
}
