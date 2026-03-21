import { z } from 'zod';

export const createRoomTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tên loại phòng không được trống'),
    description: z.string().optional(),
    capacity: z.number().int().min(1).default(2),
    amenities: z.array(z.string()).optional(),
  }),
});

export const createRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1, 'Số phòng không được trống'),
    roomTypeId: z.number().int().positive('Loại phòng không hợp lệ'),
    price: z.number().positive('Giá phòng phải lớn hơn 0'),
    description: z.string().optional(),
    floor: z.number().int().optional(),
  }),
});

export const updateRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1).optional(),
    roomTypeId: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    description: z.string().optional(),
    floor: z.number().int().optional(),
  }),
});

export const updateRoomStatusSchema = z.object({
  body: z.object({
    status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING']),
  }),
});

export const availableRoomsSchema = z.object({
  query: z.object({
    checkIn: z.string().datetime('Check-in không hợp lệ'),
    checkOut: z.string().datetime('Check-out không hợp lệ'),
  }),
});

export type CreateRoomTypeDto = z.infer<typeof createRoomTypeSchema>['body'];
export type CreateRoomDto = z.infer<typeof createRoomSchema>['body'];
export type UpdateRoomDto = z.infer<typeof updateRoomSchema>['body'];
export type UpdateRoomStatusDto = z.infer<
  typeof updateRoomStatusSchema
>['body'];
