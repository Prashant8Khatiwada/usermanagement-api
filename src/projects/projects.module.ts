import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './projects.entity';
import { Team } from '../teams/teams.entity';
import { TeamMember } from '../teams/team-member.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Team, TeamMember, User])],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule { }
