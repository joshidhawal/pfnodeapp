import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Account } from "./account.entity.js";
import { User } from "./user.entity.js";

@Entity('transaction')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transactionId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId!: string;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'accountId' })
    accountId!: string;

    @CreateDateColumn({ type: 'timestamp' })
    transactionStartTimestamp!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    transaction_end_timestamp!: Date;

    @Column('decimal', { precision: 20, scale: 4 })
    initial_amount!: number;

    @Column({ length: 10 })
    operation_type!: string;

    @Column('decimal', { precision: 20, scale: 4 })
    operating_amount!: number

    @Column('decimal', { precision: 20, scale: 4 })
    end_amount!: number;

    @Column({ length: 10 })
    transaction_type!: string

}