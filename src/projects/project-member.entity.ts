import { User } from 'src/users/user.entity';
import { Project } from './projects.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';

export enum ProjectRole {
    OWNER = 'OWNER',
    MANAGER = 'MANAGER',
    CONTRIBUTOR = 'CONTRIBUTOR',
}

@Entity()
@Unique(['user', 'project'])
export class ProjectMember {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.projectMemberships, { eager: true })
    user: User;

    @ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
    project: Project;

    @Column({ type: 'enum', enum: ProjectRole, default: ProjectRole.CONTRIBUTOR })
    role: ProjectRole;
}