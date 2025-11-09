import { Task } from '../task.entity';

export class TaskResponseDto {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    updatedAt: Date;
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
