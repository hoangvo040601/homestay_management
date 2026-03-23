import prisma from "../config/db";


const getDashBoard = async()=>{
    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const [
        totalRooms, availableRooms, occupiedRooms, maintenanceRooms,
        todayBookings, todayCheckIns, todayCheckOuts, pendingBookings, totalGuests
    ]= await Promise.all([
        //tổng số phòng
        prisma.room.count(),
        
        //phòng trống
        prisma.room.count({where:{status: 'AVAILABLE'}}),

        //phòng đang có khách
        prisma.room.count({where:{status:'OCCUPIED'}}),

        //phòng bảo trì
        prisma.room.count({where:{status:'MAINTENANCE'}}),

        //booking hôm nay
        prisma.booking.count({
            where: {
                createdAt: {
                    gt:startOfDay,
                    lt:endOfDay
                }

            }
        }),

        //check-in hôm nay
        prisma.booking.count({
            where: {
                status: 'CHECKED_IN',
                actualCheckIn: {
                    gt: startOfDay,
                    lt:endOfDay
                }
            }
        }),

        //check-out hôm nay
        prisma.booking.count({
            where: {
                status: 'CHECKED_OUT',
                actualCheckOut: {
                    gt:startOfDay,
                    lt:endOfDay
                }
            }
        }),

        //booking chờ xác nhận
        prisma.booking.count({
            where: {
                status: 'PENDING',
            }
        }),

        //tổng khách hàng
        prisma.guest.count()
    ])

    //doanh thu hôm nay
    const todayRevenue = await prisma.payment.aggregate({
        where:{
            status: 'PAID',
            paidAt: {
                gt: startOfDay,
                lt:endOfDay
            }
        },
        _sum :{amount:true}
    })

    // doanh thu tháng này
    const startOfMoth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfNextMoth = new Date(today.getFullYear(), today.getMonth()+1, 1);

    const monthRevenue = await prisma.payment.aggregate({
        where: {
            status: 'PAID',
            paidAt: {
                gte: startOfMoth,
                lt:startOfNextMoth
            }
        },
        _sum: {amount:true}
    })
    return {
        room:{
            total: totalRooms,
            available: availableRooms,
            occupied: occupiedRooms,
            maintenance: maintenanceRooms,
            occupanceRate: totalRooms >0 ? Math.round((occupiedRooms/totalRooms)*100): 0
        },
        today: {
            newBookings: todayBookings,
            checkIns: todayCheckIns,
            checkOuts: todayCheckOuts,
            revenue: Number(todayRevenue._sum.amount ?? 0),
        },
        overview: {
            pendingBookings,
            totalGuests,
            monthRevenue: Number(monthRevenue._sum.amount ?? 0),
        }
        
    }
}

// Doanh thhu

const getRevenueReport = async(from: string, to:string, /*groupBy: 'day'| 'month' = 'day'*/)=>{
    const fromDate = new Date(from)
    const toDate = new Date(to)

    if(isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) ){
        throw new Error('Ngày không hợp lệ!')
    }

    if(fromDate>toDate) throw new Error('Ngày bắt đầu phải trước ngày kết thúc!')

    // Tổng doanh thu trong khoảng
    const totalRevenue = await prisma.payment.aggregate({
        where: {
            status: 'PAID',
            paidAt:{
                gte: fromDate,
                lt: toDate
            }
        },
        _sum : {amount:true},
        _count: true
    })

    // Chi tiết payments
    const payments = await prisma.payment.findMany({
        where: {
            status: 'PAID',
            paidAt: {
                gte: fromDate,
                lt: toDate
            },
        },
        include:{
            booking: {
                include:{
                    guest: true,
                    room: true
                }
            }
        },
        orderBy: {paidAt: 'desc'}
    })


    // Doanh thu theo phương thức thanh toán
    const revenueByMethod = await prisma.payment.groupBy({
        by: ['method'],
        where: {
            status : 'PAID',
            paidAt :{
                gte: fromDate,
                lt: toDate
            }
        },
        _sum : {amount: true},
        _count: true
    })

    return {
        period: {from ,to},
        summary: {
            totalRevenue: Number(totalRevenue._sum.amount ?? 0),
            totalTransaction: Number(totalRevenue._count)
        },
        revenueByMethod : revenueByMethod.map((r)=>({
            method: r.method,
            total: Number(r._sum.amount ?? 0),
            count: r._count
        })),
        payments
    }
}

//Công suất phòng
const getOccupancyReport = async(from: string, to:string)=>{
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if(isNaN(fromDate.getTime()) || isNaN(toDate.getTime())){
        throw new Error('Ngày không hợp lệ!')
    }

    const rooms = await prisma.room.findMany({
        include :{
            roomType: true,
            bookings:{
                where: {
                    status: {notIn: ['CANCELLED']},
                    AND : [
                        {checkIn: {lt: toDate}},
                        {checkOut: {gt: fromDate}}
                    ]
                },
            }

        }
    })

    const totalDays = Math.ceil(
        (toDate.getTime()- fromDate.getTime())/(1000*60*60*24)
    )

    const occupancyData = rooms.map((room)=>{
        const occupiedDays = room.bookings.reduce((sum, booking)=>{
            const start = booking.checkIn>fromDate ? booking.checkIn : fromDate
            const end = booking.checkOut< toDate ? booking.checkOut : toDate
            const days = Math.ceil(
                (end.getTime()- start.getTime())/(1000*60*60*24)
            )  
            return sum + Math.max(0,days)
        },0)
        return {
            roomNumber: room.roomNumber,
            roomType: room.roomType.name,
            totalDays,
            occupiedDays,
            occupancyRate: totalDays > 0
        ? Math.round((occupiedDays / totalDays) * 100)
        : 0,
        }
    })
    const avgOccupancyRate = occupancyData.length > 0 ?
        Math.round(occupancyData.reduce((sum, r)=>sum + r.occupancyRate,0)/occupancyData.length):0
    
    return {
        period: {from , to, totalDays},
        avgOccupancyRate,
        rooms: occupancyData
    }
}

const getBookingReport = async(from: string, to: string)=>{
    const fromDate = new Date(from)
    const toDate = new Date(to)

    const [total, pending, confirmed, checkIn, checkOut, cancelled ]
    = await Promise.all([
        prisma.booking.count({
            where:{
                createdAt :{
                    gte: fromDate,
                    lte: toDate
                }
            }
        }),

        prisma.booking.count({
            where: {
                status: 'PENDING',
                createdAt :{
                    gte: fromDate,
                    lte: toDate
                }
            }
        }),
        prisma.booking.count({
            where: {
                status: 'CONFIRMED',
                createdAt :{
                    gte: fromDate,
                    lte: toDate
                }
            }
        }),
        prisma.booking.count({
            where: {
                status: 'CHECKED_IN',
                createdAt :{
                    gte: fromDate,
                    lte: toDate
                }
            }
        }),
        prisma.booking.count({
            where: {
                status: 'CHECKED_OUT',
                createdAt :{
                    gte: fromDate,
                    lte: toDate
                }
            }
        }),
        prisma.booking.count({
            where: {
                status: 'CANCELLED',
                createdAt :{
                    gte: fromDate,
                    lte: toDate
                }
            }
        })
    ])
    return {
        period: {from, to},
        summary:{
            total,
            pending,
            confirmed,
            checkIn,
            checkOut,
            cancelled,
            cancelledRate : total > 0 ? Math.round((cancelled /total) *100): 0
        }
    }
}

export default {getDashBoard, getRevenueReport,getOccupancyReport,getBookingReport}