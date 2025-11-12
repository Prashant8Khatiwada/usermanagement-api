import { ApiProperty } from '@nestjs/swagger';
// src/projects/dto/create-project.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ProjectStatus, ProjectPriority } from '../projects.entity';

export class CreateProjectDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(ProjectPriority)
    priority?: ProjectPriority;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    progress?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    coverImageUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    color?: string; // hex code
}
