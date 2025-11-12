import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Project } from './projects.entity';
import { User } from 'src/users/user.entity';
import { ProjectMember, ProjectRole } from './project-member.entity';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';

@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    constructor(
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,

        @InjectRepository(ProjectMember)
        private readonly memberRepo: Repository<ProjectMember>,

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
    // Create a project
    // -------------------------------
    async createProject(userId: string, dto: CreateProjectDto) {
        this.logger.log(`Creating project: userId=${userId}, name=${dto.name}`);

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            this.logger.error(`User not found: ${userId}`);
            throw new NotFoundException('User not found');
        }

        // Check for existing project with same name for this user
        const existingProject = await this.projectRepo.findOne({ where: { name: dto.name, owner: { id: userId } } });
        if (existingProject) {
            this.logger.warn(`Project with name '${dto.name}' already exists for user ${userId}`);
            throw new BadRequestException(`Project with name '${dto.name}' already exists`);
        }

        const project = this.projectRepo.create({ ...dto, owner: { id: userId } });
        this.logger.log(`Project entity created, attempting to save...`);

        try {
            const savedProject = await this.projectRepo.save(project);
            this.logger.log(`Project created successfully: id=${savedProject.id}`);

            // Add creator as owner member
            const projectMember = this.memberRepo.create({
                user: { id: userId },
                project: { id: savedProject.id },
                role: ProjectRole.OWNER,
            });
            await this.memberRepo.save(projectMember);
            this.logger.log(`Added creator as owner member`);

            return savedProject;
        } catch (error) {
            this.logger.error(`Error saving project: ${error.message}`, error.stack);
            if (error instanceof QueryFailedError) {
                throw new BadRequestException('Failed to create project due to data constraint violation');
            }
            throw error; // Re-throw other errors
        }
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

        // Check user role in project
        const membership = await this.memberRepo.findOne({
            where: { project: { id: projectId }, user: { id: userId } },
        });
        if (!membership || ![ProjectRole.OWNER, ProjectRole.MANAGER, ProjectRole.CONTRIBUTOR].includes(membership.role)) {
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
            where: { project: { id: projectId }, user: { id: userId } },
        });
        if (!membership || ![ProjectRole.OWNER, ProjectRole.MANAGER].includes(membership.role)) {
            throw new ForbiddenException('Insufficient permissions to delete project');
        }

        return this.projectRepo.remove(project);
    }

    // -------------------------------
    // Add a member to the project
    // -------------------------------
    async addMember(projectId: string, userId: string, role: ProjectRole) {
        const project = await this.getProjectById(projectId);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Check if already a member
        const existing = await this.memberRepo.findOne({ where: { project: { id: projectId }, user: { id: userId } } });
        if (existing) throw new ForbiddenException('User is already a member');

        const member = this.memberRepo.create({ project, user, role });
        return this.memberRepo.save(member);
    }

    // -------------------------------
    // Remove a member from the project
    // -------------------------------
    async removeMember(projectId: string, userId: string) {
        const member = await this.memberRepo.findOne({
            where: { project: { id: projectId }, user: { id: userId } },
        });
        if (!member) throw new NotFoundException('Member not found');

        // Optional: prevent removing OWNER if last one
        if (member.role === ProjectRole.OWNER) {
            const ownerCount = await this.memberRepo.count({ where: { project: { id: projectId }, role: ProjectRole.OWNER } });
            if (ownerCount <= 1) throw new ForbiddenException('Cannot remove the last OWNER');
        }

        return this.memberRepo.remove(member);
    }
}
