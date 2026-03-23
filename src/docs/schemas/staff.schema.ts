export const staffSchemas = {
  Staff: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Nhân viên A' },
      email: { type: 'string', example: 'staff@homestay.com' },
      role: { type: 'string', enum: ['ADMIN', 'STAFF'] },
      phone: { type: 'string', example: '0907654321' },
      isActive: { type: 'boolean', example: true },
    },
  },
  ChangePasswordRequest: {
    type: 'object',
    required: ['currentPassword', 'newPassword', 'confirmPassword'],
    properties: {
      currentPassword: { type: 'string', example: 'admin123' },
      newPassword: { type: 'string', example: 'admin456' },
      confirmPassword: { type: 'string', example: 'admin456' },
    },
  },
};