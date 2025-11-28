import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";
import { ProjectRole } from "../project-member.entity";

export class AddMemberDto {
    @ApiProperty({ example: 'e3d1d579-d3dd-4687-9b24-602dd5f8474a' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: ProjectRole.CONTRIBUTOR, enum: ProjectRole })
    role: ProjectRole;
}