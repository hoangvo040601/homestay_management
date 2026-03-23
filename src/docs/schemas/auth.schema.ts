export const authSchemas = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'admin@homestay.com' },
      password: { type: 'string', minLength: 6, example: 'admin123' },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      accessToken: { type: 'string', example: 'eyJhbGci...' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Super Admin' },
          email: { type: 'string', example: 'admin@homestay.com' },
          role: { type: 'string', enum: ['ADMIN', 'STAFF'] },
          phone: { type: 'string', example: '0901234567' },
        },
      },
    },
  },
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'password', 'role'],
    properties: {
      name: { type: 'string', example: 'Nhân viên B' },
      email: { type: 'string', format: 'email', example: 'staffb@homestay.com' },
      password: { type: 'string', minLength: 6, example: 'staff456' },
      phone: { type: 'string', example: '0909090909' },
      role: { type: 'string', enum: ['ADMIN', 'STAFF'], example: 'STAFF' },
    },
  },
  User: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Super Admin' },
      email: { type: 'string', example: 'admin@homestay.com' },
      role: { type: 'string', enum: ['ADMIN', 'STAFF'] },
      phone: { type: 'string', example: '0901234567' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
};