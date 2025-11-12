export const UserSchema = {
    type: 'object',
    properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'securePass123' },
        role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        firstName: { type: 'string', nullable: true, example: 'John' },
        lastName: { type: 'string', nullable: true, example: 'Doe' },
        email: { type: 'string', nullable: true, example: 'john.doe@example.com' },
        phone: { type: 'string', nullable: true, example: '+1234567890' },
        dateOfBirth: { type: 'string', format: 'date', nullable: true, example: '1990-01-01' }
    },
    required: ['username', 'password']
};