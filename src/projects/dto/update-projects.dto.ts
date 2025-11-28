import { ApiProperty } from '@nestjs/swagger';
// src/projects/dto/update-project.dto.ts
import { IsOptional, IsString, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ProjectStatus, ProjectPriority } from '../projects.entity';

export class UpdateProjectDto {
    @ApiProperty({ required: false, example: 'New Project' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, example: 'A sample project description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, example: ProjectStatus.PLANNING, enum: ProjectStatus })
    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @ApiProperty({ required: false, example: ProjectPriority.MEDIUM, enum: ProjectPriority })
    @IsOptional()
    @IsEnum(ProjectPriority)
    priority?: ProjectPriority;

    @ApiProperty({ required: false, example: '2023-01-01' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ required: false, example: '2023-12-31' })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiProperty({ required: false, example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    progress?: number;

    @ApiProperty({ required: false, example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString()
    coverImageUrl?: string;

    @ApiProperty({ required: false, example: '#FF5733' })
    @IsOptional()
    @IsString()
    color?: string; // hex code
}
