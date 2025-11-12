export const TeamSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', example: 'Engineering Team' }
    },
    required: ['name']
};