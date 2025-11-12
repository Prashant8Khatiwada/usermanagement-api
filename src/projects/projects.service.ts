import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './projects.entity';
import { Team } from 'src/teams/teams.entity';
import { User } from 'src/users/user.entity';
import { TeamMember, TeamRole } from 'src/teams/team-member.entity';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,

        @InjectRepository(Team)
        private readonly teamRepo: Repository<Team>,

        @InjectRepository(TeamMember)
        private readonly memberRepo: Repository<TeamMember>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    // -------------------------------
    // Find all projects for a user with optional filtering/pagination
    // -------------------------------
    async findAll(
        userId: string,
        page = 1,
        limit = 10,
        status?: string,
        priority?: string,
        teamId?: string,
    ) {
        const query = this.projectRepo
            .createQueryBuilder('project')
            .leftJoin('project.owner', 'owner')
            .leftJoin('project.team', 'team')
            .where('owner.id = :userId', { userId });

        if (status) query.andWhere('project.status = :status', { status });
        if (priority) query.andWhere('project.priority = :priority', { priority });
        if (teamId) query.andWhere('team.id = :teamId', { teamId });

        const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
        return { data, total, page, limit };
    }

    // -------------------------------
    // Create a project in a team
    // -------------------------------
    async createProject(teamId: string, userId: string, dto: CreateProjectDto) {
        const team = await this.teamRepo.findOne({ where: { id: teamId }, relations: ['members'] });
        if (!team) throw new NotFoundException('Team not found');

        // Check user role in team
        const membership = team.members.find(m => m.user.id === userId);
        if (!membership || ![TeamRole.OWNER, TeamRole.MANAGER, TeamRole.CONTRIBUTOR].includes(membership.role)) {
            throw new ForbiddenException('Insufficient permissions to create project');
        }

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        const project = this.projectRepo.create({ ...dto, team: { id: teamId }, owner: { id: userId } });
        return this.projectRepo.save(project);
    }

    // -------------------------------
    // Get single project
    // -------------------------------
    async getProjectById(projectId: string) {
        const project = await this.projectRepo.findOne({
            where: { id: projectId },
            relations: ['team', 'owner'],
        });
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    // -------------------------------
    // Update project
    // -------------------------------
    async updateProject(projectId: string, userId: string, dto: UpdateProjectDto) {
        const project = await this.getProjectById(projectId);

        // Check user role in team
        const membership = await this.memberRepo.findOne({
            where: { team: { id: project.team.id }, user: { id: userId } },
        });
        if (!membership || ![TeamRole.OWNER, TeamRole.MANAGER, TeamRole.CONTRIBUTOR].includes(membership.role)) {
            throw new ForbiddenException('Insufficient permissions to update project');
        }

        Object.assign(project, dto);
        return this.projectRepo.save(project);
    }

    // -------------------------------
    // Delete project
    // -------------------------------
    async deleteProject(projectId: string, userId: string) {
        const project = await this.getProjectById(projectId);

        const membership = await this.memberRepo.findOne({
            where: { team: { id: project.team.id }, user: { id: userId } },
        });
        if (!membership || ![TeamRole.OWNER, TeamRole.MANAGER].includes(membership.role)) {
            throw new ForbiddenException('Insufficient permissions to delete project');
        }

        return this.projectRepo.remove(project);
    }
}
