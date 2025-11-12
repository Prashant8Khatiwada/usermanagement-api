import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateTaskDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    tagIds?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    projectId?: string;

    @ApiProperty({ default: 'pending', required: false })
    @IsOptional()
    @IsString()
    status?: string;
}
