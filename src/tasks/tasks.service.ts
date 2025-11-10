import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { paginate } from 'src/common/utils/paginate';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto, PaginatedTasksResponseDto, JustMessageDto } from './dto/task-response.dto';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private repo: Repository<Task>) { }

    async create(dto: CreateTaskDto, userId: string): Promise<TaskResponseDto> {
        const task = this.repo.create({
            ...dto,
            user: { id: userId },
            category: dto.categoryId ? { id: dto.categoryId } : undefined
        });
        const savedTask = await this.repo.save(task);
        const populatedTask = await this.repo.findOne({
            where: { id: savedTask.id },
            relations: ['user', 'category']
        });
        if (!populatedTask) throw new NotFoundException('Task not found after creation');
        return {
            id: populatedTask.id,
            title: populatedTask.title,
            description: populatedTask.description,
            status: populatedTask.status,
            createdAt: populatedTask.createdAt,
            updatedAt: populatedTask.updatedAt,
            category: populatedTask.category ? {
                id: populatedTask.category.id,
                name: populatedTask.category.name,
                description: populatedTask.category.description,
            } : undefined,
        };
    }

    async findAll(userId: string, page = 1, limit = 10, status?: string, categoryId?: string): Promise<PaginatedTasksResponseDto> {
        const query = this.repo.createQueryBuilder('task')
            .leftJoin('task.user', 'user')
            .leftJoin('task.category', 'category')
            .where('user.id = :userId', { userId });

        if (status) query.andWhere('task.status = :status', { status });
        if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });
        const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();

        return paginate(data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        })), total, page, limit);
    }

    async findOne(id: string, userId: string): Promise<TaskResponseDto> {
        const task = await this.repo.findOne({ where: { id, user: { id: userId } } })
        if (!task) throw new NotFoundException('Task Not Found')
        return task;
    }

    async update(id: string, userId: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
        const taskEntity = await this.repo.findOne({ where: { id, user: { id: userId } } })
        if (!taskEntity) throw new NotFoundException('Task Not Found')
        Object.assign(taskEntity, dto)
        const updatedTask = await this.repo.save(taskEntity)
        return updatedTask;
    }

    async remove(id: string, userId: string): Promise<JustMessageDto> {
        const taskEntity = await this.repo.findOne({ where: { id, user: { id: userId } } })
        if (!taskEntity) throw new NotFoundException('Task Not Found')
        await this.repo.remove(taskEntity)
        return {
            message: `${taskEntity.title} Task Deleted`,
        }
    }

    async removeMany(ids: string[], userId: string): Promise<JustMessageDto> {
        const tasks = await this.repo.find({ where: { id: In(ids), user: { id: userId } } })
        if (!tasks.length) throw new NotFoundException('No task found for given IDs')
        await this.repo.remove(tasks)

        return { message: `${tasks.length} tasks deleted` }
    }

    async removeAll(userId: string): Promise<JustMessageDto> {
        try {
            const tasks = await this.repo.find({ where: { user: { id: userId } } });
            if (!tasks.length) return { message: 'No tasks to delete' };
            await this.repo.remove(tasks);
            return { message: 'All tasks deleted' };
        } catch (error) {
            throw error;
        }
    }
}

