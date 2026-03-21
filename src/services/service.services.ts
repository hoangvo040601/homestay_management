import prisma from "../config/db"
import { AddBookingServiceDto, CreateServiceDto, UpdateServiceDto } from "../validators/service.validator"


///SERVICES
const getAllServices = async()=>{
    return await prisma.service.findMany({
        orderBy: {createdAt: 'asc'}
    })
}

const getServiceById = async(id: number)=>{
    const service = await prisma.service.findUnique({
        where: {id}
    })
    if(!service) throw new Error('Không tìm thấy service!')
    return service
}

const createService = async(data: CreateServiceDto)=>{
    const service = await prisma.service.findFirst({
        where: {name: data.name}
    })
    if(service) throw new Error('Dịch vụ đã tồn tại!')
    return prisma.service.create({
        data: {
            name: data.name,
            price: data.price.toFixed(2),
            unit: data.unit,
            description: data.description
        }
    })
}

const updateService = async(id: number, data: UpdateServiceDto)=>{
    const service = await prisma.service.findUnique({
        where: {id}
    })
    if(!service) throw new Error('Không tìm thấy dịch vụ!')
    if(data.name && data.name !== service.name){
        const existing = await prisma.service.findFirst({
            where: {name: data.name}
        })
        if(existing) throw new Error('Tên dịch vụ đã tồn tại!')
    }
    return prisma.service.update({
        where:{id},
        data:{
            name: data.name,
            price: data.price? data.price.toFixed(2):undefined,
            unit: data.unit,
            description: data.description,
            isActive: data.isActive,
        }
    })
    
    
}
const deleteService = async(id: number)=>{
    const service = await prisma.service.findUnique({
        where: {id},
        include:{
            _count:{
                select:{ bookingServices: true }
            }
        }
    })
    if(!service) throw new Error('Không tìm thấy dịch vụ!')
    if(service._count.bookingServices > 0){
        throw new Error('Không thể xoá dịch vụ đã được sử dụng trong booking!')
    }
    return prisma.service.delete({
        where:{id}
    })
}


/// BOOKINGSERVICES
const getServiceBookings = async(bookingId: number)=>{
    const booking = await prisma.booking.findUnique({
        where:{id: bookingId}
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    return prisma.bookingService.findMany({
        where: {
            bookingId
        },
        include:{service: true}
    })
}
const addServiceToBooking = async(bookingId: number, data: AddBookingServiceDto)=>{
    const booking = await prisma.booking.findUnique({
        where:{id: bookingId}
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    if(!['PENDING', 'CONFIRMED', 'CHECKED_IN'].includes(booking.status)){
        throw new Error('Không thể thêm dịch vụ cho booking ở trạng thái này!')
    }

    const service = await prisma.service.findFirst({
        where:{id: data.serviceId}
    })
    if(!service) throw new Error('Không tìm thấy dịch vụ!')
    if(!service.isActive) throw new Error('Dịch vụ đã ngừng hoạt động!')
    
    const existing = await prisma.bookingService.findFirst({
        where : {
            bookingId,
            serviceId: data.serviceId
        }
    })
    let bookingService;
    if (existing) {
    bookingService = await prisma.bookingService.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + data.quantity },
      include: { service: true },
    });
    } else {
    bookingService = await prisma.bookingService.create({
      data: {
        bookingId,
        serviceId: data.serviceId,
        quantity: data.quantity,
        unitPrice: service.price,
      },
      include: { service: true },
    });
    }

    await recalculateTotalAmount(bookingId);
    return bookingService

}

const removeServiceFromBooking = async(bookingId: number, bookingServiceId: number)=>{
    const bookingService = await prisma.bookingService.findUnique({
        where:{id: bookingServiceId, bookingId }
    })
    if(!bookingService) throw new Error('Không tìm thấy dịch vụ trong booking!')
    await prisma.bookingService.delete({
        where: {id: bookingServiceId}
    })
    return {meessage: 'Xoá dịch vụ thành công!'}

}
//tính tiền sau khi thêm/xoá dịch vụ
const recalculateTotalAmount = async(bookingId: number, )=>{
    const booking = await prisma.booking.findUnique({
        where:{id: bookingId},
        include:{
            room:true,
            bookingServices: true
        }
    })
    if(!booking) return;


    //tiền phòng
    const nights = Math.ceil(
        (booking.checkOut.getTime()- booking.checkIn.getTime())/(1000*60*60*24)
    )
    const roomAmount = Number(booking.room.price)*nights

    //tiền dịch vụ
    const serviceAmount = booking.bookingServices.reduce((sum, bs)=>{
        return sum + Number(bs.unitPrice)*bs.quantity
    },0)

    const totalAmount = (roomAmount+serviceAmount).toFixed(2)
    await prisma.booking.update({
        where: {id: bookingId},
        data:{totalAmount}
    })
}
export default {getAllServices,getServiceById,createService,updateService,deleteService,
    getServiceBookings,addServiceToBooking,removeServiceFromBooking
}