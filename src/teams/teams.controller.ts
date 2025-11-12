import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Query, Logger, ForbiddenException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamRole } from './team-member.entity';
import { TeamRolesGuard } from 'src/common/guards/team-role.guard';
import { TeamRoles } from 'src/common/decorators/team-roles.decorator';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Team } from './teams.entity';
import { GetUserId } from 'src/common/decorators/get-user.decorator';
import { TeamSchema } from './teams.schema';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
    private readonly logger = new Logger(TeamsController.name);

    constructor(private readonly teamsService: TeamsService) { }

    // -------------------------------
    // Create a new team
    // -------------------------------
    @Post()
    @ApiOperation({ summary: 'Create a new team' })
    @ApiResponse({ status: 201, description: 'Team created', type: Team })
    @ApiBody({ type: CreateTeamDto, schema: TeamSchema })
    async createTeam(@Body() dto: CreateTeamDto, @GetUserId() userId: string) {
        return this.teamsService.createTeam(dto, userId);
    }

    // -------------------------------
    // Get all teams (pagination optional)
    // -------------------------------
    @Get()
    @ApiOperation({ summary: 'Get all teams with optional pagination' })
    @ApiResponse({ status: 200, description: 'List of teams', type: [Team] })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
        @GetUserId() userId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return this.teamsService.findAll(userId, +page, +limit);
    }

    // -------------------------------
    // Get single team by ID
    // -------------------------------
    @Get(':teamId')
    @ApiOperation({ summary: 'Get team details by ID' })
    @ApiResponse({ status: 200, description: 'Team details', type: Team })
    async getTeam(@Param('teamId') teamId: string, @GetUserId() userId: string) {
        const team = await this.teamsService.getTeamById(teamId);

        // Membership check
        const isMember = team.members.some(m => m.user.id === userId);
        if (!isMember) throw new ForbiddenException('Not a member of this team');

        return team;
    }

    // -------------------------------
    // Update team info (name, etc.)
    // -------------------------------
    @Patch(':teamId')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER)
    @ApiOperation({ summary: 'Update team information' })
    @ApiResponse({ status: 200, description: 'Team updated', type: Team })
    @ApiBody({ type: UpdateTeamDto })
    async updateTeam(@Param('teamId') teamId: string, @Body() dto: UpdateTeamDto) {
        return this.teamsService.updateTeam(teamId, dto);
    }

    // -------------------------------
    // Delete a team
    // -------------------------------
    @Delete(':teamId')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER)
    @ApiOperation({ summary: 'Delete a team' })
    @ApiResponse({ status: 200, description: 'Team deleted', type: Team })
    async deleteTeam(@Param('teamId') teamId: string) {
        return this.teamsService.deleteTeam(teamId);
    }

    // -------------------------------
    // Add member to team
    // -------------------------------
    @Post(':teamId/members')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER)
    @ApiOperation({ summary: 'Add a member to the team' })
    @ApiResponse({ status: 201, description: 'Member added', type: Team })
    @ApiBody({ type: AddMemberDto })
    async addMember(@Param('teamId') teamId: string, @Body() dto: AddMemberDto) {
        return this.teamsService.addMember(teamId, dto.userId, dto.role);
    }

    // -------------------------------
    // Remove member from team
    // -------------------------------
    @Delete(':teamId/members/:userId')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER)
    @ApiOperation({ summary: 'Remove a member from the team' })
    @ApiResponse({ status: 200, description: 'Member removed', type: Team })
    async removeMember(@Param('teamId') teamId: string, @Param('userId') userId: string) {
        return this.teamsService.removeMember(teamId, userId);
    }
}
