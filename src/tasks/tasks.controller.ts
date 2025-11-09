import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Task } from './task.entity';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
    @ApiBody({ type: CreateTaskDto })
    create(@Body() dto: CreateTaskDto, @GetUser('id') userId: string) {
        return this.tasksService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks with optional pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    findAll(
        @GetUser('id') userId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status: string,
    ) {
        return this.tasksService.findAll(userId, +page || 1, +limit || 10, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single task by ID' })
    @ApiResponse({ status: 200, description: 'Task details', type: Task })
    findOne(@Param('id') id: string, @GetUser('id') userId: string) {
        return this.tasksService.findOne(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a task by ID' })
    @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
    @ApiBody({ type: UpdateTaskDto })
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @GetUser('id') userId: string) {
        return this.tasksService.update(id, userId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task by ID' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    remove(@Param('id') id: string, @GetUser('id') userId: string) {
        return this.tasksService.remove(id, userId);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete multiple tasks by IDs' })
    @ApiResponse({ status: 200, description: 'Tasks deleted successfully' })
    @ApiBody({ schema: { properties: { ids: { type: 'array', items: { type: 'string' } } } } })
    removeMany(@Body('ids') ids: string[], @GetUser('id') userId: string) {
        return this.tasksService.removeMany(ids, userId);
    }

    @Delete('all')
    @ApiOperation({ summary: 'Delete all tasks for the user' })
    @ApiResponse({ status: 200, description: 'All tasks deleted successfully' })
    removeAll(@GetUser('id') userId: string) {
        return this.tasksService.removeAll(userId);
    }
}
