export const AddMemberSchema = {
    type: 'object',
    properties: {
        userId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
        role: { type: 'string', enum: ['OWNER', 'MANAGER', 'CONTRIBUTOR'], example: 'CONTRIBUTOR' },
    },
    required: ['userId', 'role'],
};