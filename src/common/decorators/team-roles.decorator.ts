// src/teams/team-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TeamRole } from 'src/teams/team-member.entity';

export const TEAM_ROLES_KEY = 'team_roles';
export const TeamRoles = (...roles: TeamRole[]) => SetMetadata(TEAM_ROLES_KEY, roles);
