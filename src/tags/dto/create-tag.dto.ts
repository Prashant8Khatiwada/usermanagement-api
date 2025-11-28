import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
    @ApiProperty({ example: 'urgent' })
    name: string;
}
