import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Account } from "./account.entity.js";
import { User } from "./user.entity.js";

@Entity('operations')
export class Operations {
    @PrimaryGeneratedColumn('uuid')
    operationId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId!: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'accountId' })
    accountId!: string;

    @Column({ length: 10 })
    operation_type!: string;

    @Column({ length: 100 })
    acc_column!: string;

    @Column({ length: 10 })
    data_type!: string;

    @Column('decimal', { precision: 20, scale: 4 })
    amount!: Number

    @Column('decimal', { precision: 20, scale: 4 })
    frequency!: Number

    @CreateDateColumn()
    dateCreated!: Date

    @UpdateDateColumn()
    end_date!: Date

    @Column({ length: 1 })
    status!: string
}