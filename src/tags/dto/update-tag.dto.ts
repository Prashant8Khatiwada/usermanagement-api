import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
    @ApiProperty({ required: false, example: 'urgent' })
    name?: string;
}
