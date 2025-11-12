// src/projects/dto/update-project.dto.ts
import { IsOptional, IsString, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ProjectStatus, ProjectPriority } from '../projects.entity';

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsEnum(ProjectPriority)
    priority?: ProjectPriority;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    progress?: number;

    @IsOptional()
    @IsString()
    coverImageUrl?: string;

    @IsOptional()
    @IsString()
    color?: string; // hex code
}
