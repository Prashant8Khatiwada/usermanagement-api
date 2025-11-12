import { User } from 'src/users/user.entity';
import { Team } from './teams.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';

export enum TeamRole {
    OWNER = 'OWNER',
    MANAGER = 'MANAGER',
    CONTRIBUTOR = 'CONTRIBUTOR',
    VIEWER = 'VIEWER',
}

@Entity()
@Unique(['user', 'team'])
export class TeamMember {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.teamMemberships, { eager: true })
    user: User;

    @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
    team: Team;

    @Column({ type: 'enum', enum: TeamRole, default: TeamRole.VIEWER })
    role: TeamRole;
}
