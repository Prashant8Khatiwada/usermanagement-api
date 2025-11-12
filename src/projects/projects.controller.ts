import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TeamRole } from 'src/teams/team-member.entity';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Project } from './projects.entity';
import { TeamRolesGuard } from 'src/common/guards/team-role.guard';
import { TeamRoles } from 'src/common/decorators/team-roles.decorator';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';

@Controller('teams/:teamId/projects')
@UseGuards(TeamRolesGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }
    // -------------------------------
    // POST /teams/:teamId/projects
    // -------------------------------
    @Post()
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER, TeamRole.CONTRIBUTOR)
    @ApiOperation({ summary: 'Create a new project in a team' })
    @ApiResponse({ status: 201, description: 'Project created', type: Project })
    @ApiBody({ type: CreateProjectDto })
    async create(@Param('teamId') teamId: string, @Request() req, @Body() dto: CreateProjectDto) {
        return this.projectsService.createProject(teamId, req.user.id, dto);
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
    // PATCH /teams/:teamId/projects/:projectId
    // -------------------------------
    @Patch(':projectId')
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER, TeamRole.CONTRIBUTOR)
    @ApiOperation({ summary: 'Update a project' })
    @ApiResponse({ status: 200, description: 'Project updated', type: Project })
    @ApiBody({ type: UpdateProjectDto })
    async update(@Param('projectId') projectId: string, @Request() req, @Body() dto: UpdateProjectDto) {
        return this.projectsService.updateProject(projectId, req.user.id, dto);
    }

    // -------------------------------
    // DELETE /teams/:teamId/projects/:projectId
    // -------------------------------
    @Delete(':projectId')
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER)
    @ApiOperation({ summary: 'Delete a project' })
    @ApiResponse({ status: 200, description: 'Project deleted', type: Project })
    async remove(@Param('projectId') projectId: string, @Request() req) {
        return this.projectsService.deleteProject(projectId, req.user.id);
    }
}
