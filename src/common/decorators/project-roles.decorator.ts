// src/common/decorators/project-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ProjectRole } from 'src/projects/project-member.entity';

export const PROJECT_ROLES_KEY = 'project_roles';
export const ProjectRoles = (...roles: ProjectRole[]) => SetMetadata(PROJECT_ROLES_KEY, roles);