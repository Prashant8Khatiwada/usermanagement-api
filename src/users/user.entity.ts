import { Task } from 'src/tasks/task.entity';
import { Category } from 'src/categories/categories.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tag } from 'src/tags/tags.entity';

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

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[];

    @OneToMany(() => Tag, tag => tag.user)
    tags: Tag[];

}
