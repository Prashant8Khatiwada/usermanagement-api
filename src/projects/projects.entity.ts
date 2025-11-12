import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    DeleteDateColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { ProjectMember } from './project-member.entity';
import { User } from '../users/user.entity';

export enum ProjectStatus {
    PLANNING = 'planning',
    IN_PROGRESS = 'in_progress',
    ON_HOLD = 'on_hold',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    ARCHIVED = 'archived',
}

export enum ProjectPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // ------------------------------------------------------------------
    // Extra fields that almost every real project needs
    // ------------------------------------------------------------------
    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.PLANNING,
    })
    status: ProjectStatus;

    @Column({
        type: 'enum',
        enum: ProjectPriority,
        default: ProjectPriority.MEDIUM,
    })
    priority: ProjectPriority;

    @Column({ type: 'date', nullable: true })
    startDate: Date | null;

    @Column({ type: 'date', nullable: true })
    dueDate: Date | null;

    @Column({ type: 'int', default: 0 }) // 0–100, can be calculated automatically via task completion
    progress: number;

    @Column({ type: 'varchar', nullable: true })
    coverImageUrl: string | null; // for nice UI cards

    @Column({ type: 'varchar', nullable: true })
    color: string | null; // hex color for the project (e.g. sidebar, kanban column)

    // ------------------------------------------------------------------
    // Relationships
    // ------------------------------------------------------------------
    @OneToMany(() => Task, (task) => task.project, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    tasks: Task[];

    @OneToMany(() => ProjectMember, (member) => member.project, { cascade: true, onDelete: 'CASCADE', eager: true })
    members: ProjectMember[];

    @ManyToOne(() => User, { nullable: false })
    owner: User;

    @Column({ type: 'uuid' })
    ownerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}