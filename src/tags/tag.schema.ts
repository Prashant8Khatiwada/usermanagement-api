export const TagSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', example: 'Urgent' },
    },
    required: ['name']
};
