import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nest_user',
      password: 'anihortes',
      database: 'user_db',
      autoLoadEntities: true,
      synchronize: true, // enable only in dev
    }),
    UsersModule,
  ], controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
