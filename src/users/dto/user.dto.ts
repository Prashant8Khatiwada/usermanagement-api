import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
    id: number;

    @ApiProperty({ example: 'John Doe', description: 'The username of the user' })
    username: string;
}