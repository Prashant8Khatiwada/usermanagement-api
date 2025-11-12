import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    ) { }

    async create(dto: CreateTagDto, userId: string): Promise<Tag> {
        const tag = this.tagRepo.create({
            name: dto.name,
            user: { id: userId },
        });
        return this.tagRepo.save(tag);
    }

    async findAll(userId: string): Promise<Tag[]> {
        return this.tagRepo.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    async findOne(id: string): Promise<Tag> {
        const tag = await this.tagRepo.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!tag) throw new NotFoundException('Tag not found');
        return tag;
    }

    async update(id: string, dto: UpdateTagDto, userId: string): Promise<Tag> {
        const tag = await this.findOne(id);

        if (tag.user.id !== userId) throw new ForbiddenException('You cannot update this tag');

        if (dto.name) tag.name = dto.name;
        return this.tagRepo.save(tag);
    }

    async remove(id: string, userId: string): Promise<void> {
        const tag = await this.findOne(id);

        if (tag.user.id !== userId) {
            throw new ForbiddenException('You cannot delete this tag');
        }

        await this.tagRepo.remove(tag);
    }
}
