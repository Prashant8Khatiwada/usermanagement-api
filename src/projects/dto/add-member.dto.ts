import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";
import { ProjectRole } from "../project-member.entity";

export class AddMemberDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    role: ProjectRole;
}