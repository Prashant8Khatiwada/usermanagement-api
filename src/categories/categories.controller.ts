import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUserId } from 'src/auth/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Category } from './categories.entity';
import { CategorySchema } from './categories.schema';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, type: Category })
    @ApiBody({ schema: CategorySchema })
    create(@Body() dto: CreateCategoryDto, @GetUserId('id') userId: string) {
        return this.categoriesService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories for the current user' })
    @ApiResponse({ status: 200, type: [Category] })
    findAll(@GetUserId('id') userId: string) {
        return this.categoriesService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID for current user' })
    @ApiResponse({ status: 200, type: Category })
    findOne(@Param('id') id: string, @GetUserId('id') userId: string) {
        return this.categoriesService.findOne(id, userId);
    }

    @Patch(':id')
    @ApiBody({ schema: CategorySchema })
    @ApiOperation({ summary: 'Update category by ID' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @GetUserId('id') userId: string) {
        return this.categoriesService.update(id, userId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete category (sets task.categoryId to null)' })
    remove(@Param('id') id: string, @GetUserId('id') userId: string) {
        return this.categoriesService.remove(id, userId);
    }
}
