export const ProjectSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', example: 'Project Alpha' },
        description: { type: 'string', nullable: true, example: 'A comprehensive project for developing new features' },
        status: { type: 'string', enum: ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled', 'archived'], example: 'planning' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'high' },
        startDate: { type: 'string', format: 'date', nullable: true, example: '2023-01-01' },
        dueDate: { type: 'string', format: 'date', nullable: true, example: '2023-12-31' },
        progress: { type: 'number', minimum: 0, maximum: 100, example: 50 },
        coverImageUrl: { type: 'string', nullable: true, example: 'https://example.com/image.jpg' },
        color: { type: 'string', nullable: true, example: '#FF5733' },
        teamId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
        ownerId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' }
    },
    required: ['name', 'teamId', 'ownerId']
};