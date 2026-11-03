import { Column, Entity, Unique } from "typeorm";

import { BaseEntity } from "./base.entity.js";

@Entity("attribute_master")
@Unique(["attributeCode"])
export class AttributeMaster extends BaseEntity {
  @Column({ name: "attribute", length: 100 })
  attribute!: string;

  @Column({ name: "attribute_code", length: 100 })
  attributeCode!: string;

  @Column({ name: "attribute_value", length: 100 })
  attribute_value!: string;
}
