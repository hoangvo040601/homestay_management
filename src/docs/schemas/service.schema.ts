export const serviceSchemas = {
  Service: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Ăn sáng' },
      price: { type: 'string', example: '85000' },
      unit: { type: 'string', example: 'người' },
      description: { type: 'string', example: 'Buffet sáng tại nhà hàng' },
      isActive: { type: 'boolean', example: true },
    },
  },
  CreateServiceRequest: {
    type: 'object',
    required: ['name', 'price', 'unit'],
    properties: {
      name: { type: 'string', example: 'Ăn sáng' },
      price: { type: 'number', example: 85000 },
      unit: { type: 'string', example: 'người' },
      description: { type: 'string', example: 'Buffet sáng tại nhà hàng' },
    },
  },
  AddBookingServiceRequest: {
    type: 'object',
    required: ['serviceId', 'quantity'],
    properties: {
      serviceId: { type: 'integer', example: 1 },
      quantity: { type: 'integer', example: 2, default: 1 },
    },
  },
};