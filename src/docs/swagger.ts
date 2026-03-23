import swaggerJsdoc from 'swagger-jsdoc';
import { authPaths } from '../docs/paths/auth.path';
import { roomPaths } from '../docs/paths/room.path';
import { guestPaths } from '../docs/paths/guest.path';
import { bookingPaths } from '../docs/paths/booking.path';
import { servicePaths } from '../docs/paths/service.path';
import { paymentPaths } from '../docs/paths/payment.path';
import { staffPaths } from '../docs/paths/staff.path';
import { reportPaths } from '../docs/paths/report.path';
import { authSchemas } from '../docs/schemas/auth.schema';
import { roomSchemas } from '../docs/schemas/room.schema';
import { guestSchemas } from '../docs/schemas/guest.schema';
import { bookingSchemas } from '../docs/schemas/booking.schema';
import { serviceSchemas } from '../docs/schemas/service.schema';
import { paymentSchemas } from '../docs/schemas/payment.schema';
import { staffSchemas } from '../docs/schemas/staff.schema';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Homestay Management API',
    version: '1.0.0',
    description: 'API quản lý homestay — Backend NodeJS + Express + Prisma',
    contact: {
      name: 'Homestay Dev',
      email: 'admin@homestay.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập accessToken vào đây',
      },
    },
    schemas: {
      // Response chung
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
      // Schemas từng module
      ...authSchemas,
      ...roomSchemas,
      ...guestSchemas,
      ...bookingSchemas,
      ...serviceSchemas,
      ...paymentSchemas,
      ...staffSchemas,
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Xác thực và phân quyền' },
    { name: 'Rooms', description: 'Quản lý phòng' },
    { name: 'Guests', description: 'Quản lý khách hàng' },
    { name: 'Bookings', description: 'Quản lý đặt phòng' },
    { name: 'Services', description: 'Quản lý dịch vụ' },
    { name: 'Payments', description: 'Quản lý thanh toán' },
    { name: 'Staff', description: 'Quản lý nhân viên' },
    { name: 'Reports', description: 'Báo cáo & thống kê' },
  ],
  paths: {
    ...authPaths,
    ...roomPaths,
    ...guestPaths,
    ...bookingPaths,
    ...servicePaths,
    ...paymentPaths,
    ...staffPaths,
    ...reportPaths,
  },
};