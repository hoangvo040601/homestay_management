import { z } from 'zod';

export const updateStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Tên tối thiểu 2 ký tự!').optional(),
    phone: z.string().min(10, 'Số điện thoại ít nhất 10 ký tự!').optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự!'),
      newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự!'),
      confirmPassword: z
        .string()
        .min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự!'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp!',
      path: ['confirmPassword'],
    }),
});
export const toggleStaffSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export type UpdateStaffDto = z.infer<typeof updateStaffSchema>['body'];
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>['body'];
