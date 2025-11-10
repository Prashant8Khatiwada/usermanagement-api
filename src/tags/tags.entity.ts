import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from 'src/tasks/task.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Task, task => task.tags)
    tasks: Task[];

    @ManyToOne(() => User, user => user.tags, { onDelete: 'SET NULL' })
    createdBy: User;
}
