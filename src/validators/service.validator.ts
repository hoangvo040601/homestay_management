import {z} from 'zod'
export const createSevicerSchema = z.object({
    body: z.object({
        name: z.string().min(1,'Tên dịch vụ không được trống!'),
        price: z.number().positive('Giá dịch vụ phải lớn hơn 0!'),
        unit: z.string().min(1,'Đơn vị không được để trống!').default(('lần')),
        description: z.string().optional()
    }
    )
}
)
export const updateSevicerSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        price: z.number().positive().optional(),
        unit: z.string().min(1).optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional()
    })
})

export const addBookingSevicerSchema = z.object({
    body: z.object({
        serviceId: z.number().int().positive('Dịch vụ không hợp lệ!'),
        quantity: z.number().int().min(1,'Số lượng tối thiểu là 1!').default(1)
    })
})

export type CreateServiceDto = z.infer< typeof createSevicerSchema>['body']
export type UpdateServiceDto =z.infer <typeof updateSevicerSchema>['body']
export type AddBookingServiceDto = z.infer < typeof addBookingSevicerSchema>['body']