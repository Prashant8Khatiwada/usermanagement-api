export const TaskSchema = {
    type: 'object',
    properties: {
        title: { type: 'string', example: 'Finish report' },
        description: { type: 'string', example: 'Complete the quarterly report by Friday' },
        status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
        categoryId: { type: 'string', format: 'uuid', nullable: true, example: 'uuid-of-category' },
        tagIds: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
            nullable: true,
            example: ['uuid-of-tag-1', 'uuid-of-tag-2']
        }
    },
    required: ['title']
};
