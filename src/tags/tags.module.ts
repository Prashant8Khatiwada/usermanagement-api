import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { User } from '../users/user.entity';
import { Tag } from './tags.entity';
import { Task } from '../tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User, Task])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule { }
