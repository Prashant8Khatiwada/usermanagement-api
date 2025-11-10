export const TagSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', example: 'uuid-of-tag' },
        name: { type: 'string', example: 'Urgent' },
        createdBy: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'uuid-of-user' },
                username: { type: 'string', example: 'john_doe' }
            },
            description: 'User who created the tag',
            nullable: true
        }
    },
    required: ['name']
};
