import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    username: string;

    @Column({ nullable: true })
    password: string; // will be stored hashed password
}
