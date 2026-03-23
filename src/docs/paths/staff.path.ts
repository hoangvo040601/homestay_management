export const staffPaths = {
  '/api/staff': {
    get: {
      tags: ['Staff'],
      summary: 'Lấy danh sách nhân viên (ADMIN)',
      responses: { 200: { description: 'Thành công' } },
    },
  },
  '/api/staff/change-password': {
    patch: {
      tags: ['Staff'],
      summary: 'Đổi mật khẩu',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
          },
        },
      },
      responses: {
        200: { description: 'Đổi mật khẩu thành công' },
        400: { description: 'Mật khẩu hiện tại không đúng' },
      },
    },
  },
  '/api/staff/{id}': {
    get: {
      tags: ['Staff'],
      summary: 'Lấy chi tiết nhân viên (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
    put: {
      tags: ['Staff'],
      summary: 'Cập nhật thông tin nhân viên (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Cập nhật thành công' } },
    },
    delete: {
      tags: ['Staff'],
      summary: 'Vô hiệu hoá tài khoản (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Vô hiệu hoá thành công' },
        400: { description: 'Không thể xoá tài khoản đang đăng nhập' },
      },
    },
  },
  '/api/staff/{id}/status': {
    patch: {
      tags: ['Staff'],
      summary: 'Kích hoạt/Vô hiệu hoá tài khoản (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                isActive: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      responses: { 200: { description: 'Cập nhật thành công' } },
    },
  },
};