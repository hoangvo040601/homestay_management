import { z } from 'zod';

export const createGuestSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
    email: z.string().email('Email không hợp lệ').optional(),
    phone: z.string().min(10, 'Số điện thoại tối thiểu 10 ký tự'),
    cccd: z.string().optional(),
    address: z.string().optional(),
    nationality: z.string().default('Vietnam'),
  }),
});

export const updateGuestSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).optional(),
    cccd: z.string().optional(),
    address: z.string().optional(),
    nationality: z.string().optional(),
  }),
});

export const searchGuestSchema = z.object({
  query: z.object({
    keyword: z.string().min(1, 'Từ khoá không được trống'),
  }),
});

export type CreateGuestDto = z.infer<typeof createGuestSchema>['body'];
export type UpdateGuestDto = z.infer<typeof updateGuestSchema>['body'];
