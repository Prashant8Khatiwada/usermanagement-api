export const TagSchema = {
    type: 'object',
    properties: {
        taskId: { type: 'string', example: 'uuid-of-tag' },
        name: { type: 'string', example: 'Urgent' },
    },
    required: ['name']
};
