export const guestPaths = {
  '/api/guests': {
    get: {
      tags: ['Guests'],
      summary: 'Lấy danh sách khách hàng',
      responses: { 200: { description: 'Thành công' } },
    },
    post: {
      tags: ['Guests'],
      summary: 'Tạo khách hàng mới',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateGuestRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Tạo thành công' },
        400: { description: 'SĐT hoặc CCCD đã tồn tại' },
      },
    },
  },
  '/api/guests/search': {
    get: {
      tags: ['Guests'],
      summary: 'Tìm kiếm khách hàng',
      parameters: [
        {
          in: 'query',
          name: 'keyword',
          required: true,
          schema: { type: 'string' },
          description: 'Tìm theo tên, SĐT, CCCD, email',
        },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
  },
  '/api/guests/{id}': {
    get: {
      tags: ['Guests'],
      summary: 'Lấy chi tiết khách hàng',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Thành công' },
        404: { description: 'Không tìm thấy' },
      },
    },
    put: {
      tags: ['Guests'],
      summary: 'Cập nhật khách hàng',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Cập nhật thành công' } },
    },
    delete: {
      tags: ['Guests'],
      summary: 'Xoá khách hàng (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Xoá thành công' },
        400: { description: 'Khách hàng đã có booking' },
      },
    },
  },
};