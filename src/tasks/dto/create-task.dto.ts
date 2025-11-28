import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateTaskDto {
    @ApiProperty({ example: 'Complete project' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ required: false, example: 'Task description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: false, example: 'cdb0f356-3402-4baf-8942-761498707a16' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false, type: [String], example: ['8ef7eabf-accc-4d2a-823c-39301ae1714b', '10c7c565-11f0-47ee-a098-6cbc73a1902d'] })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    tagIds?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    projectId?: string;

    @ApiProperty({ default: 'pending', required: false, example: 'pending' })
    @IsOptional()
    @IsString()
    status?: string;
}
