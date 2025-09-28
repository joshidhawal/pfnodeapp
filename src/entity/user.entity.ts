import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId!: string;

    @Column({ length: 100 })
    firstName!: string;

    @Column({ length: 100 })
    lastName!: string;

    @CreateDateColumn({ type: 'timestamp' })
    dateCreated!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    dateModified!: Date;

    @Column({ length: 1 })
    status!: string;

}

