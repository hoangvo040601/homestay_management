export const paymentPaths = {
  '/api/payments': {
    post: {
      tags: ['Payments'],
      summary: 'Tạo thanh toán',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePaymentRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Thanh toán thành công' },
        400: { description: 'Số tiền vượt quá số tiền còn lại' },
      },
    },
  },
  '/api/payments/{id}': {
    get: {
      tags: ['Payments'],
      summary: 'Lấy chi tiết thanh toán',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
    put: {
      tags: ['Payments'],
      summary: 'Cập nhật trạng thái thanh toán (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Cập nhật thành công' } },
    },
    delete: {
      tags: ['Payments'],
      summary: 'Xoá thanh toán (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Xoá thành công' } },
    },
  },
  '/api/payments/booking/{id}': {
    get: {
      tags: ['Payments'],
      summary: 'Lấy payments của booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'Booking ID' },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
  },
  '/api/payments/booking/{id}/summary': {
    get: {
      tags: ['Payments'],
      summary: 'Tổng hợp thanh toán của booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'Booking ID' },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
  },
};