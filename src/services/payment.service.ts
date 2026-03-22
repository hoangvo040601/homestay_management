import prisma from "../config/db"
import { CreatePaymentDto, UpdatePaymentDto } from "../validators/payment.validartor"


const getPaymentByBooking = async(bookingId: number)=>{
    const booking = await prisma.booking.findUnique({
        where: {id: bookingId},
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    const payments = await prisma.payment.findMany({
        where: {bookingId:bookingId},
        orderBy: {
            createdAt: 'desc'
        }
    })

    //Tính tổng payment
    const totalPayment = payments
    .filter((p)=>p.status==='PAID')
    .reduce((sum,p)=>{return sum + Number(p.amount)},0)

    //Số tiền còn lại cần trả
    const remainingAmount = Number(booking.totalAmount) -  totalPayment
    return {
        payments,
        summary:{
            totalAmount: Number(booking.totalAmount),
            totalPaid: totalPayment,
            remainingAmount: remainingAmount,
            isPaid: remainingAmount<=0
        }
    }
}

const getPaymentById = async(id: number)=>{
    const payment = await prisma.payment.findUnique({
        where: {id},
        include:{
            booking : {
                include: {
                    guest: true
                }
            }
        }
    })
    if(!payment)throw new Error('Không tìm thấy thanh toán!')
    return payment

}

const createPayment = async( data: CreatePaymentDto)=>{
    const booking = await prisma.booking.findUnique({
        where: {id: data.bookingId},
        include: {
            payments: true
        }
    })
    if(!booking) throw new Error('Không tìm thấy thanh toán!')
    if(booking.status==='CANCELLED') throw new Error('Không thể thanh toán cho booking đã huỷ!')
    
    //Tính tổng tiền đã thanh toán
    const toatalPayment = booking.payments
    .filter((p)=>p.status ==='PAID')
    .reduce((sum, p)=>{return sum + Number(p.amount)},0)

    //Số tiền còn lại cần trả
    const remainingAmount = Number(booking.totalAmount)-toatalPayment

    //Kiểm tra số tiền thanh toán
    if(data.amount > remainingAmount){
        throw new Error(`Số tiền thanh toán vượt quá số tiền còn lại (${remainingAmount.toLocaleString('vi-VN')})`)
    }

    //tạo payment
    const payment = await prisma.payment.create({
        data:{
            bookingId: data.bookingId,
            amount: data.amount.toFixed(2),
            method: data.method,
            status: 'PAID',
            paidAt: new Date(),
            note: data.note
        },
        include: {
            booking: { include: { guest: true } },
        },
    })
    return payment

}

const updatePayment = async(id: number, data: UpdatePaymentDto)=>{
    const payment = await prisma.payment.findUnique({
        where:{id: id}
    })
    if(!payment) throw new Error('Không tìm thấy thanh toán!')
    
    return prisma.payment.update({
        where:{id},
        data:{
            status: data.status,
            note: data.note,
            paidAt: data.status === 'PAID'?new Date():payment.paidAt,
        },
        include:{
            booking:true
        }
    })
}

const deletePayment = async(id: number)=>{
    const payment = await prisma.payment.findUnique({
        where: {id},
    })
    if(!payment)throw new Error('Không tìm thấy thanh toán!')
    if(payment.status === 'PAID'){
        throw new Error('Không thể xoá thanh toán đã hoàn thành!')
    }
    return prisma.payment.delete({where:{id}})
}

const getPaymentSummary = async(bookingId: number)=>{
    const booking = await prisma.booking.findUnique({
        where: {id:bookingId},
        include:{
            payments:true,
            guest:true,
            room:true
        }
    })
    if(!booking)throw new Error('Không tìm thấy booking!')
    
    const totalPaid = booking.payments
    .filter((p)=>p.status=='PAID')
    .reduce((sum,p)=>sum+Number(p.amount),0)

    const totalRefunded = booking.payments
    .filter((p)=>p.status=='REFUNDED')
    .reduce((sum,p)=>sum+Number(p.amount),0)

    const remainingAmount = Number(booking.totalAmount)-totalPaid+totalRefunded;

    return {
        booking:{
            id: booking.id,
            status: booking.status,
            totalAmount: Number(booking.totalAmount),
            guest: booking.guest,
            room: booking.room,
        },
        payment:{
            payment: booking.payments
        },
        summary: {
            totalAmount: Number(booking.totalAmount),
            totalPaid,
            totalRefunded,
            remainingAmount,
            isPaid: remainingAmount <= 0,
    },
    }
    
}
export default{getPaymentByBooking,getPaymentById,createPayment,updatePayment,deletePayment,getPaymentSummary}