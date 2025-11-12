import { Injectable, NotFoundException, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository, In } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { paginate } from 'src/common/utils/paginate';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto, PaginatedTasksResponseDto, JustMessageDto } from './dto/task-response.dto';
import { Tag } from '../tags/tags.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task) private repo: Repository<Task>,
        @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
        private readonly projectsService: ProjectsService,
    ) { }

    private async validateTagOwnership(tagIds: string[], userId: string): Promise<Tag[]> {
        if (!tagIds || tagIds.length === 0) return [];

        const tags = await this.tagRepo.find({
            where: { id: In(tagIds) },
            relations: ['user'],
        });

        // Check if all requested tags exist
        if (tags.length !== tagIds.length) {
            throw new NotFoundException('Some tags were not found');
        }

        // Validate ownership
        const unauthorizedTags = tags.filter(tag => tag.user.id !== userId);
        if (unauthorizedTags.length > 0) {
            throw new ForbiddenException('You can only attach your own tags to tasks');
        }

        return tags;
    }

    async create(dto: CreateTaskDto, userId: string): Promise<TaskResponseDto> {
        // Validate and prepare tags if provided
        let tags: Tag[] = [];
        if (dto.tagIds) {
            tags = await this.validateTagOwnership(dto.tagIds, userId);
        }

        // Validate project if provided
        if (dto.projectId) {
            await this.projectsService.getProjectById(dto.projectId);
        }

        const task = this.repo.create({
            title: dto.title,
            description: dto.description,
            user: { id: userId },
            category: dto.categoryId ? { id: dto.categoryId } : undefined,
            project: dto.projectId ? { id: dto.projectId } : undefined,
            tags: tags
        });

        const savedTask = await this.repo.save(task);
        const populatedTask = await this.repo.findOne({
            where: { id: savedTask.id },
            relations: ['user', 'category', 'project', 'tags', 'tags.user']
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
            project: populatedTask.project ? {
                id: populatedTask.project.id,
                name: populatedTask.project.name,
                description: populatedTask.project.description,
            } : undefined,
            tags: populatedTask.tags ? populatedTask.tags.map(tag => ({
                id: tag.id,
                name: tag.name,
            })) : [],
            user: {
                id: populatedTask.user.id,
                username: populatedTask.user.username,
            },
        };
    }

    async findAll(userId: string, page = 1, limit = 10, status?: string, categoryId?: string, projectId?: string): Promise<PaginatedTasksResponseDto> {
        this.logger.log(`findAll called with userId: ${userId}, page: ${page}, limit: ${limit}, status: ${status}, categoryId: ${categoryId}, projectId: ${projectId}`);

        const query = this.repo.createQueryBuilder('task')
            .leftJoin('task.user', 'user')
            .leftJoin('task.category', 'category')
            .leftJoin('task.project', 'project')
            .leftJoin('task.tags', 'tag')
            .leftJoin('tag.user', 'tagUser')
            .where('user.id = :userId', { userId })
            .select([
                'task.id',
                'task.title',
                'task.description',
                'task.status',
                'task.createdAt',
                'task.updatedAt',
                'user.id',
                'user.username',
                'category.id',
                'category.name',
                'category.description',
                'project.id',
                'project.name',
                'project.description',
                'tag.id',
                'tag.name',
                'tagUser.id'
            ]);

        if (status) query.andWhere('task.status = :status', { status });
        if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });

        this.logger.log(`Executing query: ${query.getQuery()}`);
        const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
        this.logger.log(`Query returned ${data.length} tasks out of ${total} total`);

        // Group tags by task
        const taskMap = new Map();
        data.forEach(task => {
            if (!taskMap.has(task.id)) {
                taskMap.set(task.id, {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                    category: task.category ? {
                        id: task.category.id,
                        name: task.category.name,
                        description: task.category.description,
                    } : undefined,
                    project: task.project ? {
                        id: task.project.id,
                        name: task.project.name,
                        description: task.project.description,
                    } : undefined,
                    tags: [],
                    user: {
                        id: task.user.id,
                        username: task.user.username,
                    },
                });
            }

            // Add tag if exists
            if (task['tag.id']) {
                const existingTask = taskMap.get(task.id);
                const tagExists = existingTask.tags.some(t => t.id === task['tag.id']);
                if (!tagExists) {
                    existingTask.tags.push({
                        id: task['tag.id'],
                        name: task['tag.name'],
                        userId: task['tagUser.id']
                    });
                }
            }
        });

        const resultData = Array.from(taskMap.values());

        return paginate(resultData, total, page, limit);
    }

    async findByProjectId(projectId: string, page = 1, limit = 10, status?: string, categoryId?: string): Promise<PaginatedTasksResponseDto> {
        this.logger.log(`findByProjectId called with projectId: ${projectId}, page: ${page}, limit: ${limit}, status: ${status}, categoryId: ${categoryId}`);

        const query = this.repo.createQueryBuilder('task')
            .leftJoin('task.user', 'user')
            .leftJoin('task.category', 'category')
            .leftJoin('task.project', 'project')
            .leftJoin('task.tags', 'tag')
            .leftJoin('tag.user', 'tagUser')
            .where('project.id = :projectId', { projectId })
            .select([
                'task.id',
                'task.title',
                'task.description',
                'task.status',
                'task.createdAt',
                'task.updatedAt',
                'user.id',
                'user.username',
                'category.id',
                'category.name',
                'category.description',
                'project.id',
                'project.name',
                'project.description',
                'tag.id',
                'tag.name',
                'tagUser.id'
            ]);

        if (status) query.andWhere('task.status = :status', { status });
        if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });
        if (projectId) query.andWhere('project.id = :projectId', { projectId });

        this.logger.log(`Executing query: ${query.getQuery()}`);
        const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
        this.logger.log(`Query returned ${data.length} tasks out of ${total} total`);

        // Group tags by task
        const taskMap = new Map();
        data.forEach(task => {
            if (!taskMap.has(task.id)) {
                taskMap.set(task.id, {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                    category: task.category ? {
                        id: task.category.id,
                        name: task.category.name,
                        description: task.category.description,
                    } : undefined,
                    project: task.project ? {
                        id: task.project.id,
                        name: task.project.name,
                        description: task.project.description,
                    } : undefined,
                    tags: [],
                    user: {
                        id: task.user.id,
                        username: task.user.username,
                    },
                });
            }

            // Add tag if exists
            if (task['tag.id']) {
                const existingTask = taskMap.get(task.id);
                const tagExists = existingTask.tags.some(t => t.id === task['tag.id']);
                if (!tagExists) {
                    existingTask.tags.push({
                        id: task['tag.id'],
                        name: task['tag.name'],
                        userId: task['tagUser.id']
                    });
                }
            }
        });

        const resultData = Array.from(taskMap.values());

        return paginate(resultData, total, page, limit);
    }

    async findOne(id: string, userId: string): Promise<TaskResponseDto> {
        const task = await this.repo.findOne({
            where: { id, user: { id: userId } },
            relations: ['user', 'category', 'project', 'tags', 'tags.user']
        });
        if (!task) throw new NotFoundException('Task Not Found');
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            category: task.category ? {
                id: task.category.id,
                name: task.category.name,
                description: task.category.description,
            } : undefined,
            project: task.project ? {
                id: task.project.id,
                name: task.project.name,
                description: task.project.description,
            } : undefined,
            tags: task.tags ? task.tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                userId: tag.user.id
            })) : [],
            user: {
                id: task.user.id,
                username: task.user.username,
            },
        };
    }

    async update(id: string, userId: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
        const taskEntity = await this.repo.findOne({
            where: { id, user: { id: userId } },
            relations: ['user', 'category', 'project', 'tags']
        });

        if (!taskEntity) throw new NotFoundException('Task Not Found');

        // Handle tag updates if provided
        if (dto.tagIds) {
            const newTags = await this.validateTagOwnership(dto.tagIds, userId);
            taskEntity.tags = newTags;
        }

        // Update other fields
        if (dto.title) taskEntity.title = dto.title;
        if (dto.description !== undefined) taskEntity.description = dto.description;
        if (dto.categoryId !== undefined) {
            taskEntity.category = dto.categoryId ? { id: dto.categoryId, name: '', description: '' } as any : null;
        }

        const updatedTask = await this.repo.save(taskEntity);

        // Return the updated task with all relations
        const finalTask = await this.repo.findOne({
            where: { id: updatedTask.id },
            relations: ['user', 'category', 'project', 'tags', 'tags.user']
        });

        if (!finalTask) throw new NotFoundException('Task not found after update');

        return {
            id: finalTask.id,
            title: finalTask.title,
            description: finalTask.description,
            status: finalTask.status,
            createdAt: finalTask.createdAt,
            updatedAt: finalTask.updatedAt,
            category: finalTask.category ? {
                id: finalTask.category.id,
                name: finalTask.category.name,
                description: finalTask.category.description,
            } : undefined,
            project: finalTask.project ? {
                id: finalTask.project.id,
                name: finalTask.project.name,
                description: finalTask.project.description,
            } : undefined,
            tags: finalTask.tags ? finalTask.tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                userId: tag.user.id
            })) : [],
            user: {
                id: finalTask.user.id,
                username: finalTask.user.username,
            },
        };
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

