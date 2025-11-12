import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamRole } from './team-member.entity';
import { TeamRolesGuard } from 'src/common/guards/team-role.guard';
import { TeamRoles } from 'src/common/decorators/team-roles.decorator';
import { UpdateTeamDto } from './dto/update-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    // -------------------------------
    // Create a new team
    // -------------------------------
    @Post()
    async createTeam(@Body() dto: CreateTeamDto, @Request() req) {
        const user = req.user;
        return this.teamsService.createTeam(dto, user.id);
    }

    // -------------------------------
    // Get all teams the user is a member of
    // -------------------------------
    @Get()
    async getMyTeams(@Request() req) {
        const user = req.user;
        return this.teamsService.getTeamsByUser(user.id);
    }

    // -------------------------------
    // Get single team by ID
    // -------------------------------
    @Get(':teamId')
    async getTeam(@Param('teamId') teamId: string, @Request() req) {
        const user = req.user;
        const team = await this.teamsService.getTeamById(teamId);

        // Optional: check membership
        const isMember = team.members.some(m => m.user.id === user.id);
        if (!isMember) throw new ForbiddenException('Not a member of this team');

        return team;
    }

    // -------------------------------
    // Update team info (name, etc.)
    // -------------------------------
    @Patch(':teamId')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER)
    async updateTeam(@Param('teamId') teamId: string, @Body() dto: UpdateTeamDto) {
        return this.teamsService.updateTeam(teamId, dto);
    }

    // -------------------------------
    // Delete a team
    // -------------------------------
    @Delete(':teamId')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER)
    async deleteTeam(@Param('teamId') teamId: string) {
        return this.teamsService.deleteTeam(teamId);
    }

    // -------------------------------
    // Add member to team
    // -------------------------------
    @Post(':teamId/members')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER, TeamRole.MANAGER)
    async addMember(@Param('teamId') teamId: string, @Body() dto: AddMemberDto) {
        return this.teamsService.addMember(teamId, dto.userId, dto.role);
    }

    // -------------------------------
    // Remove member from team
    // -------------------------------
    @Delete(':teamId/members/:userId')
    @UseGuards(TeamRolesGuard)
    @TeamRoles(TeamRole.OWNER)
    async removeMember(@Param('teamId') teamId: string, @Param('userId') userId: string) {
        return this.teamsService.removeMember(teamId, userId);
    }
}
