export const authPaths = {
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Đăng nhập',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Đăng nhập thành công',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/LoginResponse' },
                    },
                  },
                ],
              },
            },
          },
        },
        401: { description: 'Sai email hoặc mật khẩu' },
        422: { description: 'Dữ liệu không hợp lệ' },
      },
    },
  },
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Đăng xuất',
      responses: {
        200: { description: 'Đăng xuất thành công' },
        401: { description: 'Chưa xác thực' },
      },
    },
  },
  '/api/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Làm mới access token',
      security: [],
      description: 'Dùng refreshToken từ HttpOnly Cookie',
      responses: {
        200: { description: 'Làm mới token thành công' },
        401: { description: 'Refresh token không hợp lệ' },
      },
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Lấy thông tin user hiện tại',
      responses: {
        200: {
          description: 'Thành công',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                ],
              },
            },
          },
        },
        401: { description: 'Chưa xác thực' },
      },
    },
  },
  '/api/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Tạo tài khoản nhân viên (ADMIN)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Tạo tài khoản thành công' },
        400: { description: 'Email đã tồn tại' },
        403: { description: 'Không có quyền truy cập' },
      },
    },
  },
};