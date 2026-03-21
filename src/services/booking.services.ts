import prisma from "../config/db"
import { CreateBookingDto, UpdateBookingDto } from "../validators/booking.validator"

// Kiểm tra xem phòng có trống hay không
const checkRoomAvailability = async(roomId: number, checkIn: string, checkOut: string, excludeBookingId?: number)=>{

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const existRoom = await prisma.booking.findFirst({
        where: {
            roomId,
            id: excludeBookingId ? {not: excludeBookingId} : undefined,
            status: {notIn: ['CANCELLED','CHECKED_OUT']},
            AND: [
                { checkIn:  { lt: checkOutDate } },  // ← booking cũ bắt đầu TRƯỚC checkOut mới
                { checkOut: { gt: checkInDate } },   // ← booking cũ kết thúc SAU checkIn mới
            ],
        }
    })
    return !existRoom
}
// tính tổng tiền 
const calculateTotalAmount = async (roomId: number, checkIn: string, checkOut: string)=>{
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const room = await prisma.room.findUnique({
        where: {id:roomId}
    })
    if(!room) throw new Error('Không tìm thấy phòng!')
    const nights = Math.ceil(
        (checkOutDate.getTime()-checkInDate.getTime())/(1000*60*60*24)
    )
    return Number(room.price)*nights

}


const getAllBookings = async(status?: string, date?: string)=>{
    const booking = await prisma.booking.findMany({
        where:{
            ...(status && {status: status as any}),
            ...(date && {
                checkIn:{
                    gte: new Date(date),
                    lt: new Date(new Date(date).setDate(new Date(date).getDate()+1))
            }

            })
        },
        include: {
            guest: true,
            room: {include: {roomType: true}},
            staff: {select: {id: true, name: true, email:true}},
            payments:true
        },
        orderBy: {createdAt:'desc'},
    })
    return booking
}

const getBookingById = async(id: number)=>{
    const booking = await prisma.booking.findUnique({
        where: {
            id: id
        },
        include :{
            guest: true,
            room: {include: {roomType: true}},
            staff: {select: {id: true, name: true, email:true}},
            bookingServices: { include: { service: true } },
            payments:true
        }
    })
    if(!booking) throw new Error('Không tìm thấy booking!')
    return booking
}

const createBooking = async(data: CreateBookingDto,staffId: number)=>{
    const guest = await prisma.guest.findUnique({
        where:{id: data.guestId}
    })
    if(!guest)throw new Error('Không tìm thấy khách hàng')

    const room = await prisma.room.findUnique({
        where: {id: data.roomId}
    }) 
    if(!room)throw new Error('Không tìm thấy phòng!')
    if(room.status === 'MAINTENANCE') throw new Error('Phòng đang bảo trì, không thể đặt!')

    const isAvailable = await checkRoomAvailability(data.roomId, data.checkIn, data.checkOut)
    if(!isAvailable) throw new Error('Phòng đã được đặt trong khoảng thời gian này!')
        

    const totalAmount = await calculateTotalAmount(data.roomId, data.checkIn, data.checkOut);

    const booking = await prisma.booking.create(
        {
            data: {
                guestId: data.guestId,
                roomId: data.roomId,
                staffId,
                checkIn: new Date(data.checkIn),
                checkOut: new Date(data.checkOut),
                adults: data.adults,
                children: data.children,
                totalAmount: totalAmount.toString(),
                notes: data.notes,
                status: 'PENDING',
            },
            include:{
                guest: true,
                room: { include: { roomType: true } },
                staff: { select: { id: true, name: true, email: true } },
            }
        }
    )
    return booking
}

const updateBooking = async(id: number, data: UpdateBookingDto)=>{
    const booking = await prisma.booking.findUnique({
        where: {id:id}
    })
    if(!booking) throw new Error('Không tìm thấy booking!')
    if(['CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].includes(booking.status)){
        throw new Error('Không thể cập nhật booking ở trạng thái này!')
    }

    let totalAmount = Number(booking.totalAmount);
    const checkIn = data.checkIn || booking.checkIn.toISOString();
    const checkOut = data.checkOut || booking.checkOut.toISOString();

    if(data.checkIn||data.checkOut){
        const isAvailable = await checkRoomAvailability(
            booking.roomId,
            checkIn,
            checkOut,
            id
        )
        if(!isAvailable)throw new Error('Phòng đã được đặt trong khoảng thời gian này!')

    }
    return prisma.booking.update({
        where:{id},
        data:{
            checkIn: data.checkIn ? new Date(data.checkIn): undefined,
            checkOut: data.checkOut ? new Date(data.checkOut): undefined,
            adults: data.adults,
            children:data.children,
            notes: data.notes,
            totalAmount
        },
        include:{
            guest: true,
            room: {
                include:{roomType: true}
            }
        }
    })

}

const confirmBooking = async(id: number)=>{
    const booking = await prisma.booking.findUnique({
        where: {id}
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    if(booking.status !== 'PENDING'){
        throw new Error('Chỉ có thể xác nhận booking ở trạng thái PENDING!')
    }
    return prisma.booking.update({
        where: {id},
        data:{
            status:'CONFIRMED'
        },
        include:{
            guest:true,
            room:true
        }

    })
}

const checkInBooking = async(id:number)=>{
    const booking = await prisma.booking.findUnique({
        where: {id},
        include : {
            room: true
        }
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    if(booking.status !== 'CONFIRMED'){
        throw new Error('Chỉ có thể check-in booking ở trạng thái CONFIRMED!')
    }

    const updatedBooking = await prisma.$transaction(async(tx)=>{
        await tx.room.update({
        where: { id: booking.roomId },
        data: { status: 'OCCUPIED' },
        });
        const updated = await tx.booking.update({
            where: {id},
            data:{
                status:'CHECKED_IN',
                actualCheckIn: new Date()
            },
            include:{
                guest: true,
                room:true
            }
        })
        return updated
    }
    )
    return updatedBooking
}

const checkOutBooking = async(id:number)=>{
    const booking = await prisma.booking.findUnique({
        where: {id},
        include :{
            room:true
        }
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    if(booking.status !=='CHECKED_IN'){
        throw new Error('Chỉ có thể check-out booking ở trạng thái CHECKED_IN ')
    }

    const updateBooking = await prisma.$transaction(async(tx)=>{
        await tx.room.update({
            where: {id: booking.roomId},
            data:{
                status:'AVAILABLE',
            }
        })
        const updated = await tx.booking.update({
            where: {id},
            data:{
                status: 'CHECKED_OUT',
                actualCheckOut: new Date(),
            },
            include:{
                guest: true,
                room: true
            }
        })
        return updated
    })
    return updateBooking
}

const cancelBooking = async(id: number)=>{
    const booking = await prisma.booking.findUnique({
        where: {id}
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    if(['CHCKED_IN', 'CHECK_OUT', 'CACELLED'].includes(booking.status)){
        throw new Error('Không thể huỷ booking ở trạng thá này!')
    }
    return prisma.booking.update({
        where:{id},
        data: {
            status: 'CANCELLED'
        },
        include: {
            guest: true,
            room:true,
            
        }
    })
}
export default {getAllBookings,getBookingById,createBooking,updateBooking,confirmBooking,checkInBooking,checkOutBooking,cancelBooking}