import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 'e3d1d579-d3dd-4687-9b24-602dd5f8474a', description: 'The unique identifier of the user' })
    id: string;

    @ApiProperty({ example: 'John Doe', description: 'The username of the user' })
    username: string;
}