import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import type { IUser } from './users.service'; // type only

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    getAllUsers(): IUser[] {
        return this.usersService.findAll()
    }

    @Get(':id')
    getByUserId(@Param('id') id: string): IUser {
        const user = this.usersService.findone(Number(id))
        if (!user) throw new NotFoundException(`User with id ${id} not found`)
        return user;
    }

    @Post()
    createUser(@Body() user: IUser): IUser {
        return this.usersService.create(user)
    }

    @Patch(":id")
    updateUser(@Param('id') id: string, @Body() updatedData: Partial<IUser>): IUser {
        const user = this.usersService.update(Number(id), updatedData)
        if (!user) throw new NotFoundException(`User with id ${id} not found`)
        return user
    }

    @Delete()
    deleteUser(@Param('id') id: string): { message: string } {
        const success = this.usersService.remove(Number(id));
        if (!success) throw new NotFoundException(`User with id ${id} not found`);
        return { message: `User ${id} deleted successfully` };
    }
}

