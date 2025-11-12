// src/teams/team-roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember, TeamRole } from 'src/teams/team-member.entity';
import { TEAM_ROLES_KEY } from '../decorators/team-roles.decorator';

@Injectable()
export class TeamRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(TeamMember)
        private teamMemberRepo: Repository<TeamMember>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles: TeamRole[] = this.reflector.getAllAndOverride<TeamRole[]>(
            TEAM_ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) return true; // no roles required

        const request = context.switchToHttp().getRequest();
        const user = request.user; // assume JWT AuthGuard set req.user
        const teamId = request.params.teamId;

        if (!teamId) throw new ForbiddenException('Team ID not provided');

        // Check user role in team
        const membership = await this.teamMemberRepo.findOne({
            where: { team: { id: teamId }, user: { id: user.id } },
        });

        if (!membership) throw new ForbiddenException('User is not a member of this team');

        if (!requiredRoles.includes(membership.role)) {
            throw new ForbiddenException('Insufficient team permissions');
        }

        return true;
    }
}
