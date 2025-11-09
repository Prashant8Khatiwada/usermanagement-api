import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { paginate } from 'src/utils/paginate';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto, PaginatedTasksResponseDto, JustMessageDto } from './dto/task-response.dto';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private repo: Repository<Task>) { }

    async create(dto: CreateTaskDto, userId: string): Promise<TaskResponseDto> {
        const task = this.repo.create({ ...dto, user: { id: userId } });
        const savedTask = await this.repo.save(task);
        return savedTask;
    }

    async findAll(userId: string, page = 1, limit = 10, status?: string): Promise<PaginatedTasksResponseDto> {
        console.log('findAll called with userId:', userId, 'page:', page, 'limit:', limit, 'status:', status);
        const query = this.repo.createQueryBuilder('task')
            .leftJoin('task.user', 'user')
            .where('user.id = :userId', { userId });

        if (status) query.andWhere('task.status = :status', { status });

        console.log('Query SQL:', query.getSql());
        const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
        console.log("Retrieved data count:", data.length, "total:", total);
        console.log("this is required data", data)

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
        const tasks = await this.repo.find({ where: { user: { id: userId } } });
        if (!tasks.length) return { message: 'No tasks to delete' };
        await this.repo.remove(tasks);

        return { message: 'All tasks deleted' };
    }
}

