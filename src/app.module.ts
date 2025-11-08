import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || '',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || '',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // enable only in dev
    }),
    UsersModule,
    AuthModule,
    ProfileModule,
  ], controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
