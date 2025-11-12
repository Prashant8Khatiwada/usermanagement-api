import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './projects.entity';
import { ProjectMember } from './project-member.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember, User])],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule { }
