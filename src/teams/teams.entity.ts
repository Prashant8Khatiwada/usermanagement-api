import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { Project } from 'src/projects/projects.entity';

@Entity()
@Unique(['name'])
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    // Members of this team, including roles
    @OneToMany(() => TeamMember, (member) => member.team, { cascade: true, eager: true })
    members: TeamMember[];

    // Projects under this team
    @OneToMany(() => Project, (project) => project.team)
    projects: Project[];
}
