export const paymentSchemas = {
  Payment: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      bookingId: { type: 'integer', example: 1 },
      amount: { type: 'string', example: '1000000' },
      method: { type: 'string', enum: ['CASH', 'BANK_TRANSFER', 'CARD'] },
      status: { type: 'string', enum: ['PENDING', 'PAID', 'REFUNDED'] },
      paidAt: { type: 'string', format: 'date-time' },
      note: { type: 'string', example: 'Đặt cọc 1 triệu' },
    },
  },
  CreatePaymentRequest: {
    type: 'object',
    required: ['bookingId', 'amount', 'method'],
    properties: {
      bookingId: { type: 'integer', example: 1 },
      amount: { type: 'number', example: 1000000 },
      method: { type: 'string', enum: ['CASH', 'BANK_TRANSFER', 'CARD'] },
      note: { type: 'string', example: 'Đặt cọc 1 triệu' },
    },
  },
};