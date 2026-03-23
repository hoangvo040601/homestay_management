export const servicePaths = {
  '/api/services': {
    get: {
      tags: ['Services'],
      summary: 'Lấy danh sách dịch vụ',
      responses: { 200: { description: 'Thành công' } },
    },
    post: {
      tags: ['Services'],
      summary: 'Tạo dịch vụ mới (ADMIN)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateServiceRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Tạo thành công' },
        400: { description: 'Tên dịch vụ đã tồn tại' },
      },
    },
  },
  '/api/services/{id}': {
    get: {
      tags: ['Services'],
      summary: 'Lấy chi tiết dịch vụ',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
    put: {
      tags: ['Services'],
      summary: 'Cập nhật dịch vụ (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Cập nhật thành công' } },
    },
    delete: {
      tags: ['Services'],
      summary: 'Xoá dịch vụ (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Xoá thành công' } },
    },
  },
  '/api/services/booking/{id}': {
    get: {
      tags: ['Services'],
      summary: 'Lấy dịch vụ của booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'Booking ID' },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
    post: {
      tags: ['Services'],
      summary: 'Thêm dịch vụ vào booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'Booking ID' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AddBookingServiceRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Thêm thành công' },
        400: { description: 'Booking hoặc dịch vụ không hợp lệ' },
      },
    },
  },
  '/api/services/booking/{id}/{serviceId}': {
    delete: {
      tags: ['Services'],
      summary: 'Xoá dịch vụ khỏi booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'Booking ID' },
        { in: 'path', name: 'serviceId', required: true, schema: { type: 'integer' }, description: 'BookingService ID' },
      ],
      responses: { 200: { description: 'Xoá thành công' } },
    },
  },
};