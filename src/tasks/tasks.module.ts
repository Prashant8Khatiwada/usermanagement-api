import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { Tag } from '../tags/tags.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Tag]), forwardRef(() => ProjectsModule)],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule { }
