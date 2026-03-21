import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'STAFF']).default('STAFF'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token không được trống'),
  }),
});
export const getRefreshTokenExpiry = (): Date => {
  const days = 7; // khớp với JWT_REFRESH_EXPIRES=7d
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export type LoginDto = z.infer<typeof loginSchema>['body'];
export type RegisterDto = z.infer<typeof registerSchema>['body'];
