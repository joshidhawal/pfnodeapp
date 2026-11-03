import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
  @PrimaryColumn({
    name: "id",
    type: "bigint",
    default: () => "nextval('nextid')",
  }) // use bigint for large range
  // @Generated('sequence', { sequenceName: 'nextid' }) // temporarily commenting due to typescript types error in strict environment.
  id!: string;

  @CreateDateColumn({
    name: "date_created",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  dateCreated!: Date;

  @UpdateDateColumn({
    name: "date_modified",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  dateModified!: Date;

  @Column({ name: "created_by", length: 100 })
  createdBy!: string;

  @Column({ name: "modified_by", length: 100 })
  modifiedBy!: string;
}
