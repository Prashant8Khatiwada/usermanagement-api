// src/common/guards/project-role.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMember, ProjectRole } from 'src/projects/project-member.entity';
import { PROJECT_ROLES_KEY } from '../decorators/project-roles.decorator';

@Injectable()
export class ProjectRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(ProjectMember)
        private projectMemberRepo: Repository<ProjectMember>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles: ProjectRole[] = this.reflector.getAllAndOverride<ProjectRole[]>(
            PROJECT_ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) return true; // no roles required

        const request = context.switchToHttp().getRequest();
        const user = request.user; // assume JWT AuthGuard set req.user
        const projectId = request.params.projectId;

        if (!projectId) throw new ForbiddenException('Project ID not provided');

        // Check user role in project
        const membership = await this.projectMemberRepo.findOne({
            where: { project: { id: projectId }, user: { id: user.id } },
        });

        if (!membership) throw new ForbiddenException('User is not a member of this project');

        if (!requiredRoles.includes(membership.role)) {
            throw new ForbiddenException('Insufficient project permissions');
        }

        return true;
    }
}