import { Task } from '../task.entity';

export class TagResponseDto {
    id: string;
    name: string;
}

export class TaskResponseDto {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
    category?: {
        id: string;
        name: string;
        description?: string;
    };
    tags: TagResponseDto[];
    user: {
        id: string;
        username: string;
    };
}

export class PaginatedTasksResponseDto {
    data: TaskResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export class JustMessageDto {
    message: string;
}
