import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Work' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false, example: 'Category for work-related tasks' })
    @IsOptional()
    @IsString()
    description?: string;
}