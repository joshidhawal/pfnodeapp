import { Column, Entity, Unique } from "typeorm";

import { BaseEntity } from "./base.entity.js";

@Entity("users")
@Unique(["userId"])
export class User extends BaseEntity {
  @Column({ length: 100 })
  userId!: string;

  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 1 })
  status!: string;
}
