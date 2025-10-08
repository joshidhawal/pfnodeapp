import { Column, Entity, Unique } from "typeorm";
import { BaseEntity } from "./base.entity.js";

@Entity("attribute_master")
@Unique(["attributeCode"])
export class AttributeMaster extends BaseEntity {
  @Column({ length: 100 })
  attribute!: string;

  @Column({ length: 100 })
  attributeCode!: string;

  @Column({ length: 100 })
  attribute_value!: string;
}
