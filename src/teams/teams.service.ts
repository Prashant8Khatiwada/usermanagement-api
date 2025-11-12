import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './teams.entity';
import { TeamMember, TeamRole } from './team-member.entity';
import { User } from 'src/users/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepo: Repository<Team>,

        @InjectRepository(TeamMember)
        private readonly memberRepo: Repository<TeamMember>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    // -------------------------------
    // Create a new team and assign owner
    // -------------------------------
    async createTeam(dto: CreateTeamDto, ownerId: string) {
        const owner = await this.userRepo.findOne({ where: { id: ownerId } });
        if (!owner) throw new NotFoundException('Owner user not found');

        const team = this.teamRepo.create({ name: dto.name });
        await this.teamRepo.save(team);

        // Add owner as team member
        const ownerMember = this.memberRepo.create({
            team,
            user: owner,
            role: TeamRole.OWNER,
        });
        await this.memberRepo.save(ownerMember);

        return team;
    }

    // -------------------------------
    // Get all teams a user belongs to
    // -------------------------------
    async getTeamsByUser(userId: string) {
        return this.memberRepo.find({
            where: { user: { id: userId } },
            relations: ['team'],
        }).then(memberships => memberships.map(m => m.team));
    }

    // -------------------------------
    // Get single team by ID
    // -------------------------------
    async getTeamById(teamId: string) {
        const team = await this.teamRepo.findOne({
            where: { id: teamId },
            relations: ['members', 'members.user', 'projects'],
        });
        if (!team) throw new NotFoundException('Team not found');
        return team;
    }

    // -------------------------------
    // Update team
    // -------------------------------
    async updateTeam(teamId: string, dto: UpdateTeamDto) {
        const team = await this.getTeamById(teamId);
        if (dto.name) team.name = dto.name;
        return this.teamRepo.save(team);
    }

    // -------------------------------
    // Delete team
    // -------------------------------
    async deleteTeam(teamId: string) {
        const team = await this.getTeamById(teamId);
        return this.teamRepo.remove(team);
    }

    // -------------------------------
    // Add a member to the team
    // -------------------------------
    async addMember(teamId: string, userId: string, role: TeamRole) {
        const team = await this.getTeamById(teamId);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Check if already a member
        const existing = await this.memberRepo.findOne({ where: { team: { id: teamId }, user: { id: userId } } });
        if (existing) throw new ForbiddenException('User is already a member');

        const member = this.memberRepo.create({ team, user, role });
        return this.memberRepo.save(member);
    }

    // -------------------------------
    // Remove a member from the team
    // -------------------------------
    async removeMember(teamId: string, userId: string) {
        const member = await this.memberRepo.findOne({
            where: { team: { id: teamId }, user: { id: userId } },
        });
        if (!member) throw new NotFoundException('Member not found');

        // Optional: prevent removing OWNER if last one
        if (member.role === TeamRole.OWNER) {
            const ownerCount = await this.memberRepo.count({ where: { team: { id: teamId }, role: TeamRole.OWNER } });
            if (ownerCount <= 1) throw new ForbiddenException('Cannot remove the last OWNER');
        }

        return this.memberRepo.remove(member);
    }
}
