import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JustMessageDto } from 'src/tasks/dto/task-response.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private repo: Repository<Category>) { }

    async create(dto: CreateCategoryDto, userId: string): Promise<Category> {
        const category = this.repo.create({ ...dto, user: { id: userId } })
        const savedCategory = await this.repo.save(category)
        return savedCategory
    }

    async findAll(userId: string): Promise<Category[]> {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: ['tasks']
        })
    }

    async findOne(id: string, userId: string): Promise<Category> {
        const category = await this.repo.findOne({
            where: { id, user: { id: userId } },
            relations: ['tasks'],
        })
        if (!category) throw new NotFoundException('Category not found');

        return category
    }

    async update(id: string, userId: string, dto: UpdateCategoryDto): Promise<UpdateCategoryDto> {
        const category = await this.findOne(id, userId);
        Object.assign(category, dto)
        const savedCategory = await this.repo.save(category)
        return savedCategory
    }

    async remove(id: string, userId: string): Promise<JustMessageDto> {
        const category = await this.findOne(id, userId);
        await this.repo.remove(category);
        return { message: 'Category deleted' };
    }

    async removeMany(ids: string[], userId: string): Promise<JustMessageDto> {
        const category = await this.repo.find({
            where: { id: In(ids), user: { id: userId } },
            relations: ['tasks']
        })
        if (!category.length) throw new NotFoundException('No categories found for given IDs')
        await this.repo.remove(category)
        return { message: `${category.length} tasks deleted` }
    }

    async removeAll(userId: string): Promise<JustMessageDto> {
        try {
            const categories = await this.repo.find({ where: { user: { id: userId } }, relations: ['tasks'] });
            if (!categories.length) return { message: 'No categories to delete' };
            await this.repo.remove(categories);
            return { message: 'All categories deleted' };
        } catch (error) {
            throw error;
        }
    }
}
