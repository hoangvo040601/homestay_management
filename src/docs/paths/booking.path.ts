export const bookingPaths = {
  '/api/bookings': {
    get: {
      tags: ['Bookings'],
      summary: 'Lấy danh sách booking',
      parameters: [
        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'],
          },
        },
        {
          in: 'query',
          name: 'date',
          schema: { type: 'string', format: 'date' },
          example: '2026-03-21',
        },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
    post: {
      tags: ['Bookings'],
      summary: 'Tạo booking mới',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateBookingRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Tạo booking thành công' },
        400: { description: 'Phòng đã được đặt' },
      },
    },
  },
  '/api/bookings/{id}': {
    get: {
      tags: ['Bookings'],
      summary: 'Lấy chi tiết booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Thành công' } },
    },
    put: {
      tags: ['Bookings'],
      summary: 'Cập nhật booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: { 200: { description: 'Cập nhật thành công' } },
    },
  },
  '/api/bookings/{id}/confirm': {
    patch: {
      tags: ['Bookings'],
      summary: 'Xác nhận booking (PENDING → CONFIRMED)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Xác nhận thành công' },
        400: { description: 'Booking không ở trạng thái PENDING' },
      },
    },
  },
  '/api/bookings/{id}/checkin': {
    patch: {
      tags: ['Bookings'],
      summary: 'Check-in (CONFIRMED → CHECKED_IN)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Check-in thành công' },
        400: { description: 'Booking không ở trạng thái CONFIRMED' },
      },
    },
  },
  '/api/bookings/{id}/checkout': {
    patch: {
      tags: ['Bookings'],
      summary: 'Check-out (CHECKED_IN → CHECKED_OUT)',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Check-out thành công' },
        400: { description: 'Booking không ở trạng thái CHECKED_IN' },
      },
    },
  },
  '/api/bookings/{id}/cancel': {
    patch: {
      tags: ['Bookings'],
      summary: 'Huỷ booking',
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Huỷ thành công' },
        400: { description: 'Không thể huỷ booking ở trạng thái này' },
      },
    },
  },
};