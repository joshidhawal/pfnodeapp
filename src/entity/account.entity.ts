import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    accountId!: string;

    @Column({ length: 10, })
    accountType!: string;

    @Column({ length: 10 })
    accountSubtype!: string;

    @Column({ length: 100 })
    accountName!: string;

    @CreateDateColumn()
    dateCreated!: Date;

    @UpdateDateColumn()
    dateModified!: Date;

    @Column({ length: 1 })
    status!: string;

    @Column('decimal', { precision: 20, scale: 4 })
    balance!: number;

}