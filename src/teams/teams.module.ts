import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './teams.entity';
import { TeamMember } from './team-member.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, TeamMember, User]),
    UsersModule,
  ],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule { }
