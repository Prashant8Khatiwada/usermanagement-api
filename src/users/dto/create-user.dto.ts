import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;

    @ApiProperty({ example: 'John', description: 'The first name of the user' })
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
    lastName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    email: string;

    @ApiProperty({ example: '+1234567890', description: 'The phone number of the user' })
    phone: string;

    @ApiProperty({ example: '1990-01-01', description: 'The date of birth of the user' })
    dateOfBirth: string;
}