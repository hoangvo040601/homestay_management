import {z} from 'zod'


export const createPaymentSchema = z.object({
    body: z.object({
        bookingId: z.number().int().positive('Booking không hợp lệ!'),
        amount: z.number().positive('Số tiền phải lớn hơn 0!'),
        method: z.enum(['CASH', 'BANK_TRANSFER', 'CARD'],{
            error: 'Phương thức thanh toán không hợp lệ!'}),
        note: z.string(),
        }),
})

export const updatePaymentschema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'PAID', 'REFUNDED'], 
            {
                error: 'Trạng thái thanh toán không hợp lệ!'
            }
        ),
        note: z.string().optional().nullable(),   // ← thêm nullable()
})
})

export type CreatePaymentDto = z.infer < typeof createPaymentSchema>['body']
export type UpdatePaymentDto = z.infer < typeof updatePaymentschema>['body']