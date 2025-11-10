import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUserId } from 'src/auth/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Task } from './task.entity';
import { TaskSchema } from './task.schema';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    private readonly logger = new Logger(TasksController.name);

    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
    @ApiBody({ type: CreateTaskDto, schema: TaskSchema })
    create(@Body() dto: CreateTaskDto, @GetUserId('id') userId: string) {
        return this.tasksService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks with optional pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number, default 1' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page, default 10' })
    @ApiQuery({ name: 'status', required: false, type: String, example: 'pending', description: 'Filter tasks by status' })
    @ApiQuery({ name: 'categoryId', required: false, type: String, example: 'uuid', description: 'Filter tasks by category ID' })
    findAll(
        @GetUserId('id') userId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status: 'pending' | 'in-progress' | 'completed',
        @Query('categoryId') categoryId: string,
    ) {
        this.logger.log(`TasksController.findAll called with userId: ${userId}, page: ${page}, limit: ${limit}, status: ${status}, categoryId: ${categoryId}`);
        return this.tasksService.findAll(userId, +page || 1, +limit || 10, status, categoryId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single task by ID' })
    @ApiResponse({ status: 200, description: 'Task details', type: Task })
    findOne(@Param('id') id: string, @GetUserId('id') userId: string) {
        return this.tasksService.findOne(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a task by ID' })
    @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
    @ApiBody({ type: CreateTaskDto, schema: TaskSchema })
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @GetUserId('id') userId: string) {
        return this.tasksService.update(id, userId, dto);
    }

    @Delete('all')
    @ApiOperation({ summary: 'Delete all tasks for the user' })
    @ApiResponse({ status: 200, description: 'All tasks deleted successfully', schema: { example: { message: 'All tasks deleted' } } })
    removeAll(@GetUserId('id') userId: string) {
        return this.tasksService.removeAll(userId);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete multiple tasks by IDs' })
    @ApiResponse({ status: 200, description: 'Tasks deleted successfully', schema: { example: { message: '3 tasks deleted' } } })
    @ApiBody({ schema: { type: 'array', items: { type: 'string' }, example: ['id1', 'id2'] } })
    removeMany(@Body() ids: string[], @GetUserId('id') userId: string) {
        return this.tasksService.removeMany(ids, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task by ID' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully', schema: { example: { message: 'Task Title Task Deleted' } } })
    remove(@Param('id') id: string, @GetUserId('id') userId: string) {
        return this.tasksService.remove(id, userId);
    }
}

