import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    username: string;

    @Column({ nullable: true })
    password: string; // will be stored hashed password

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: "admin" | "user";

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth: string;
}
