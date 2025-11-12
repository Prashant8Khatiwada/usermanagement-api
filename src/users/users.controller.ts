import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, BadRequestException, UseGuards, Request, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, User } from '../users/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { UserSchema } from './users.schema';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users with optional pagination and filtering' })
    @ApiResponse({ status: 200, description: 'List of users', type: [User] })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number, default 1' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page, default 10' })
    @ApiQuery({ name: 'role', required: false, type: String, example: 'user', description: 'Filter by role' })
    findAll(
        @GetUserId('id') userId: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('role') role: string,
    ) {
        this.logger.log(`UsersController.findAll called with userId: ${userId}, page: ${page}, limit: ${limit}, role: ${role}`);
        return this.usersService.findAll(userId, +page || 1, +limit || 10, role);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) throw new NotFoundException('User not found');

        // Destructure after null-check
        const { password, ...userWithoutPassword } = user;

        return { ...userWithoutPassword, message: 'Profile data retrieved successfully' };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: String, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User found', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getByUserId(@Param('id') id: string): Promise<UserDto> {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new BadRequestException('Invalid user ID format');
        }
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto, schema: UserSchema })
    @ApiResponse({ status: 201, description: 'User created', type: UserDto })
    @Roles(UserRole.ADMIN) // only admins can create
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createUser(@Body() user: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(user)
    }

    @Patch(":id")
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiParam({ name: 'id', type: String, description: 'User ID' })
    @ApiBody({ type: UpdateUserDto, schema: UserSchema })
    @ApiResponse({ status: 200, description: 'User updated', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(
        @Param('id') id: string,
        @Body() updatedData: UpdateUserDto,
    ): Promise<UserDto> {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new BadRequestException('Invalid user ID format');
        }
        const user = await this.usersService.update(id, updatedData);
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiParam({ name: 'id', type: String, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Roles(UserRole.ADMIN) // only admins can Delete
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new BadRequestException('Invalid user ID format');
        }
        // Await the user
        const user = await this.usersService.findOne(id);
        if (!user) { throw new NotFoundException(`User with ID ${id} not found`); }

        const success = await this.usersService.remove(id);
        if (!success) { throw new NotFoundException(`User with ID ${id} could not be deleted`); }

        return { message: `User ${user.username} deleted successfully` };
    }
}

