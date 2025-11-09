import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    })
    status: 'pending' | 'in-progress' | 'completed';

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}