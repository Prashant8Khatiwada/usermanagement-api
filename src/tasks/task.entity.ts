import { Category } from "src/categories/categories.entity";
import { Tag } from "src/tags/tags.entity";
import { User } from "../users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "src/projects/projects.entity";

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

    @ManyToOne(() => Category, (category) => category.tasks, { onDelete: "SET NULL", nullable: true })
    category: Category

    @ManyToMany(() => Tag, tag => tag.tasks, { cascade: true })
    @JoinTable()
    tags: Tag[];

    @Column({ type: 'uuid', nullable: true })
    projectId: string;

    @ManyToOne(() => Project, project => project.tasks, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}