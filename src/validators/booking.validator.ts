import {z} from 'zod'

export const createBookingSchema = z.object({
    body: z.object({
        guestId : z.number().int().positive('Guest không hợp lệ!'),
        roomId: z.number().int().positive('Phòng không hợp lệ!'),
        checkIn: z.string().datetime('Ngày check-in không hợp lệ!'),
        checkOut: z.string().datetime('Ngày check-out không hợp lệ!'),
        adults: z.number().int().min(1).default(1),
        children: z.number().int().min(0).default(0),
        notes: z.string().optional(),
    }).refine(
        (data)=>new Date(data.checkIn)< new Date(data.checkOut),
        {message: 'Ngày check-out phải sau ngày check-in!', path: ['checkOut']}
    )
})

export const updateBookingSchema = z.object({
    body: z.object({
        checkIn: z.string().datetime().optional(),
        checkOut: z.string().datetime().optional(),
        adults: z.number().int().min(1).optional(),
        children: z.number().int().min(0).optional(),
        notes: z.string().optional(),
    })
})
export const filterBookingSchema = z.object({
    query: z.object({
        status: z.enum([
            'PENDING',
            'CONFIRMED',
            'CHECKED_IN',
            'CHECKED_OUT',
            'CANCELLED',
        ]).optional()
    })
})
export type CreateBookingDto = z.infer< typeof createBookingSchema>['body']
export type UpdateBookingDto = z.infer< typeof updateBookingSchema>['body']
