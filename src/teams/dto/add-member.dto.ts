import { IsNotEmpty, IsString } from "class-validator";
import { TeamRole } from "../team-member.entity";

export class AddMemberDto {
    @IsString()
    @IsNotEmpty()

    userId: string;
    role: TeamRole;
}
