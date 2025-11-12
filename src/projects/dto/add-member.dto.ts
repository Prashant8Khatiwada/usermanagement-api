import { IsNotEmpty, IsString } from "class-validator";
import { ProjectRole } from "../project-member.entity";

export class AddMemberDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    role: ProjectRole;
}