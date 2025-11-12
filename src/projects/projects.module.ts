import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './projects.entity';
import { ProjectMember } from './project-member.entity';
import { User } from '../users/user.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMember, User]), forwardRef(() => TasksModule)],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule { }
