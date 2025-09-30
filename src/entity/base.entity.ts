import {
  CreateDateColumn,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
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
}
