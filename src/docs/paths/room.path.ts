export const roomPaths = {
  '/api/rooms': {
    get: {
      tags: ['Rooms'],
      summary: 'Lấy danh sách phòng',
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
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Room' },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Rooms'],
      summary: 'Tạo phòng mới (ADMIN)',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateRoomRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Tạo phòng thành công' },
        400: { description: 'Số phòng đã tồn tại' },
        403: { description: 'Không có quyền truy cập' },
      },
    },
  },
  '/api/rooms/available': {
    get: {
      tags: ['Rooms'],
      summary: 'Lấy phòng trống theo ngày',
      parameters: [
        {
          in: 'query',
          name: 'checkIn',
          required: true,
          schema: { type: 'string', format: 'date-time' },
          example: '2026-03-21T14:00:00.000Z',
        },
        {
          in: 'query',
          name: 'checkOut',
          required: true,
          schema: { type: 'string', format: 'date-time' },
          example: '2026-03-25T12:00:00.000Z',
        },
      ],
      responses: {
        200: { description: 'Danh sách phòng trống' },
        422: { description: 'Dữ liệu không hợp lệ' },
      },
    },
  },
  '/api/rooms/{id}': {
    get: {
      tags: ['Rooms'],
      summary: 'Lấy chi tiết phòng',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Thành công' },
        404: { description: 'Không tìm thấy phòng' },
      },
    },
    put: {
      tags: ['Rooms'],
      summary: 'Cập nhật phòng (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Cập nhật thành công' },
        403: { description: 'Không có quyền truy cập' },
      },
    },
    delete: {
      tags: ['Rooms'],
      summary: 'Xoá phòng (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Xoá thành công' },
        400: { description: 'Phòng đã có booking' },
        403: { description: 'Không có quyền truy cập' },
      },
    },
  },
  '/api/rooms/{id}/status': {
    patch: {
      tags: ['Rooms'],
      summary: 'Cập nhật trạng thái phòng (ADMIN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateRoomStatusRequest' },
          },
        },
      },
      responses: {
        200: { description: 'Cập nhật thành công' },
        403: { description: 'Không có quyền truy cập' },
      },
    },
  },
  '/api/rooms/types': {
    get: {
      tags: ['Rooms'],
      summary: 'Lấy danh sách loại phòng',
      responses: { 200: { description: 'Thành công' } },
    },
    post: {
      tags: ['Rooms'],
      summary: 'Tạo loại phòng (ADMIN)',
      responses: {
        201: { description: 'Tạo thành công' },
        403: { description: 'Không có quyền truy cập' },
      },
    },
  },
};