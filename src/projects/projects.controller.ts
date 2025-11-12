import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMember, ProjectRole } from './project-member.entity';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Project } from './projects.entity';
import { ProjectRolesGuard } from 'src/common/guards/project-role.guard';
import { ProjectRoles } from 'src/common/decorators/project-roles.decorator';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { AddMemberSchema } from './dto/add-member.schema';
import { ProjectSchema } from './projects.schema';

@Controller('projects')
@UseGuards(ProjectRolesGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }
    // -------------------------------
    // POST /projects
    // -------------------------------
    @Post()
    @ProjectRoles(ProjectRole.OWNER, ProjectRole.MANAGER, ProjectRole.CONTRIBUTOR)
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'Project created', type: Project })
    @ApiBody({ type: CreateProjectDto, schema: ProjectSchema })
    async create(@Request() req, @Body() dto: CreateProjectDto) {
        return this.projectsService.createProject(req.user.id, dto);
    }

    // -------------------------------
    // GET /teams/:teamId/projects
    // -------------------------------
    @Get()
    @ApiOperation({ summary: 'Get all projects with optional pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of projects', type: [Project] })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number, default 1' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page, default 10' })
    @ApiQuery({ name: 'status', required: false, type: String, example: 'planning', description: 'Filter projects by status' })
    @ApiQuery({ name: 'priority', required: false, type: String, example: 'medium', description: 'Filter projects by priority' })
    async findAll(
        @Request() req,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: string,
        @Query('priority') priority?: string,
        @Param('teamId') teamId?: string,
    ) {
        return this.projectsService.findAll(req.user.id, Number(page), Number(limit), status, priority, teamId);
    }

    // -------------------------------
    // GET /teams/:teamId/projects/:projectId
    // -------------------------------
    @Get(':projectId')
    @ApiOperation({ summary: 'Get single project details' })
    @ApiResponse({ status: 200, description: 'Project details', type: Project })
    async getOne(@Param('projectId') projectId: string) {
        return this.projectsService.getProjectById(projectId);
    }

    // -------------------------------
    // PATCH /projects/:projectId
    // -------------------------------
    @Patch(':projectId')
    @ProjectRoles(ProjectRole.OWNER, ProjectRole.MANAGER, ProjectRole.CONTRIBUTOR)
    @ApiOperation({ summary: 'Update a project' })
    @ApiResponse({ status: 200, description: 'Project updated', type: Project })
    @ApiBody({ type: UpdateProjectDto, schema: ProjectSchema })
    async update(@Param('projectId') projectId: string, @Request() req, @Body() dto: UpdateProjectDto) {
        return this.projectsService.updateProject(projectId, req.user.id, dto);
    }

    // -------------------------------
    // DELETE /projects/:projectId
    // -------------------------------
    @Delete(':projectId')
    @ProjectRoles(ProjectRole.OWNER, ProjectRole.MANAGER)
    @ApiOperation({ summary: 'Delete a project' })
    @ApiResponse({ status: 200, description: 'Project deleted', type: Project })
    async remove(@Param('projectId') projectId: string, @Request() req) {
        return this.projectsService.deleteProject(projectId, req.user.id);
    }

    // -------------------------------
    // POST /projects/:projectId/members
    // -------------------------------
    @Post(':projectId/members')
    @ProjectRoles(ProjectRole.OWNER, ProjectRole.MANAGER)
    @ApiOperation({ summary: 'Add a member to the project' })
    @ApiResponse({ status: 201, description: 'Member added', type: ProjectMember })
    @ApiBody({ type: AddMemberDto, schema: AddMemberSchema })
    async addMember(@Param('projectId') projectId: string, @Body() dto: AddMemberDto) {
        return this.projectsService.addMember(projectId, dto.userId, dto.role);
    }

    // -------------------------------
    // DELETE /projects/:projectId/members/:userId
    // -------------------------------
    @Delete(':projectId/members/:userId')
    @ProjectRoles(ProjectRole.OWNER)
    @ApiOperation({ summary: 'Remove a member from the project' })
    @ApiResponse({ status: 200, description: 'Member removed', type: ProjectMember })
    async removeMember(@Param('projectId') projectId: string, @Param('userId') userId: string) {
        return this.projectsService.removeMember(projectId, userId);
    }
}
