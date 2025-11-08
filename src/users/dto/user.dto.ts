import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'The unique identifier of the user' })
    id: string;

    @ApiProperty({ example: 'John Doe', description: 'The username of the user' })
    username: string;
}