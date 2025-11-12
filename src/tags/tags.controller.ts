import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagSchema } from './tag.schema';
import { GetUserId } from 'src/common/decorators/get-user.decorator';

@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new tag for the authenticated user' })
    @ApiBody({ schema: TagSchema })
    @ApiResponse({ status: 201, description: 'Tag created successfully', schema: TagSchema })
    create(@Body() dto: CreateTagDto, @GetUserId('id') userId: string) {
        return this.tagsService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tags for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of tags for the user', schema: { type: 'array', items: TagSchema } })
    findAll(@GetUserId('id') userId: string) {
        return this.tagsService.findAll(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a tag by ID' })
    @ApiBody({ schema: TagSchema }) // use same body schema for update
    @ApiResponse({ status: 200, description: 'Tag updated successfully', schema: TagSchema })
    update(@Param('id') id: string, @Body() dto: UpdateTagDto, @GetUserId('id') userId: string) {
        return this.tagsService.update(id, dto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tag by ID' })
    @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
    remove(@Param('id') id: string, @GetUserId('id') userId: string) {
        return this.tagsService.remove(id, userId);
    }
}
