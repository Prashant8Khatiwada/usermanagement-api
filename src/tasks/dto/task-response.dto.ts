import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../task.entity';

export class TagResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}

export class TaskResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty()
    status: 'pending' | 'in-progress' | 'completed';

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false })
    category?: {
        id: string;
        name: string;
        description?: string;
    };

    @ApiProperty({ required: false })
    project?: {
        id: string;
        name: string;
        description?: string;
    };

    @ApiProperty({ type: [TagResponseDto] })
    tags: TagResponseDto[];

    @ApiProperty()
    user: {
        id: string;
        username: string;
    };
}

export class PaginatedTasksResponseDto {
    @ApiProperty({ type: [TaskResponseDto] })
    data: TaskResponseDto[];

    @ApiProperty()
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export class JustMessageDto {
    @ApiProperty()
    message: string;
}
