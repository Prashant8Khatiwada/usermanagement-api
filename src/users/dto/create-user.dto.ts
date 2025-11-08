import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;
}