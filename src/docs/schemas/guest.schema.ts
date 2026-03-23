export const guestSchemas = {
  Guest: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      fullName: { type: 'string', example: 'Nguyễn Văn An' },
      email: { type: 'string', example: 'an.nguyen@gmail.com' },
      phone: { type: 'string', example: '0912345678' },
      cccd: { type: 'string', example: '001099012345' },
      address: { type: 'string', example: '123 Nguyễn Huệ, Q1, TP.HCM' },
      nationality: { type: 'string', example: 'Vietnam' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateGuestRequest: {
    type: 'object',
    required: ['fullName', 'phone'],
    properties: {
      fullName: { type: 'string', example: 'Nguyễn Văn An' },
      email: { type: 'string', example: 'an.nguyen@gmail.com' },
      phone: { type: 'string', example: '0912345678' },
      cccd: { type: 'string', example: '001099012345' },
      address: { type: 'string', example: '123 Nguyễn Huệ, Q1, TP.HCM' },
      nationality: { type: 'string', example: 'Vietnam' },
    },
  },
};