export const TaskSchema = {
    type: 'object',
    properties: {
        title: { type: 'string', example: 'Finish report' },
        description: { type: 'string', example: 'Complete the quarterly report by Friday' },
        status: { type: 'string', example: 'pending' }, // pending, in-progress, done
        categoryId: { type: 'string', example: 'uuid-of-category' }
    },
    required: ['title']
};
