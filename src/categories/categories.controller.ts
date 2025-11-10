import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Category } from './categories.entity';
import { JustMessageDto } from '../tasks/dto/task-response.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto, @GetUser('id') userId: string): Promise<Category> {
        return this.categoriesService.create(createCategoryDto, userId);
    }

    @Get()
    async findAll(@GetUser('id') userId: string): Promise<Category[]> {
        return this.categoriesService.findAll(userId);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @GetUser('id') userId: string): Promise<Category> {
        return this.categoriesService.update(id, userId, updateCategoryDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @GetUser('id') userId: string): Promise<JustMessageDto> {
        return this.categoriesService.remove(id, userId);
    }
}
