import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users', type: [UserDto] })
    async getAllUsers(): Promise<UserDto[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User found', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getByUserId(@Param('id') id: string): Promise<UserDto> {
        const parsedId = Number(id);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new BadRequestException('Invalid user ID');
        }
        const user = await this.usersService.findOne(parsedId);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created', type: UserDto })
    async createUser(@Body() user: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(user)
    }

    @Patch(":id")
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User updated', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(
        @Param('id') id: string,
        @Body() updatedData: UpdateUserDto,
    ): Promise<UserDto> {
        const parsedId = Number(id);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new BadRequestException('Invalid user ID');
        }
        const user = await this.usersService.update(parsedId, updatedData);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        const parsedId = Number(id);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new BadRequestException('Invalid user ID');
        }
        const success = await this.usersService.remove(parsedId);
        if (!success) throw new NotFoundException(`User with id ${id} not found`);
        return { message: `User ${id} deleted successfully` };
    }
}

