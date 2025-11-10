import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetUserId } from '../auth/get-user.decorator';
import { TagSchema } from './tag.schema';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new tag' })
    @ApiBody({ schema: TagSchema })
    @ApiResponse({ status: 201, description: 'Tag created successfully', schema: TagSchema })
    create(@Body() dto: CreateTagDto, @GetUserId('id') userId: string) {
        console.log(userId, "user id id ")
        return this.tagsService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tags' })
    @ApiResponse({ status: 200, description: 'List of tags', schema: { type: 'array', items: TagSchema } })
    findAll() {
        return this.tagsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a tag by ID' })
    @ApiBody({ schema: TagSchema }) // use same body schema for update
    @ApiResponse({ status: 200, description: 'Tag updated successfully', schema: TagSchema })
    update(@Param('id') id: string, @Body() dto: UpdateTagDto, @GetUserId('id') userId: string) {
        return this.tagsService.update(id, dto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tag by ID' })
    @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
    remove(@Param('id') id: string, @GetUserId('id') userId: string) {
        return this.tagsService.remove(id, userId);
    }
}
