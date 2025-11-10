export const CategorySchema = {
    type: 'object',
    properties: {
        name: { type: 'string', example: 'Personal' },
        description: { type: 'string', example: 'Personal tasks' },
    },
    required: ['name'], // optional, mark required fields
};
