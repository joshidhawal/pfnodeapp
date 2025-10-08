import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
  @PrimaryColumn({ type: "bigint", default: () => "nextval('nextid')" }) // use bigint for large range
  // @Generated('sequence', { sequenceName: 'nextid' }) // temporarily commenting due to typescript types error in strict environment.
  id!: string;

  @CreateDateColumn({ type: "timestamptz" })
  dateCreated!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  dateModified!: Date;

  @Column({ length: 100 })
  createdBy!: string;

  @Column({ length: 100 })
  modifiedBy!: string;
}
