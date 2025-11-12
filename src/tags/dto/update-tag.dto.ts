import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
    @ApiProperty({ required: false })
    name?: string;
}
