import prisma from "../config/db"
import { CreateGuestDto, UpdateGuestDto } from "../validators/guest.validator"


const getAllGuests = async()=>{
    const guests = await prisma.guest.findMany({
        orderBy: {createdAt: 'desc'}
    })
    return guests
}

const getGuestById = async(id: number)=>{
    const guest = await prisma.guest.findUnique({
        where: {id:id},
        include:{
            bookings:{
                include: {
                    room: true
                },
                orderBy: {createdAt: 'desc'}
            }
        }
    })
    if(!guest) throw new Error('Không tìm thấy khách hàng!')
    return guest

}

const createGuest = async(data: CreateGuestDto )=>{
    if(data.cccd){
        const existCccd = await prisma.guest.findUnique({
            where: {cccd: data.cccd}
        });
        if(existCccd) throw new Error('CCCD đã tồn tại!');
    }
    const existPhone = await prisma.guest.findFirst({
        where: {phone: data.phone}
    })
    if(existPhone) throw new Error('Số điện thoại đã tồn tại!')
    
    return prisma.guest.create(
        {data}
    )
}

const updateGuest = async(id: number, data:UpdateGuestDto)=>{
    const guest = await prisma.guest.findUnique({
        where: {
            id:id,
        }
    })
    if(!guest) throw new Error('Không tìm thấy khách hàng!')
    if(data.phone && data.phone !== guest.phone){
        const existPhone = await prisma.guest.findFirst({
            where: {phone: data.phone}
        })
        if(existPhone) throw new Error('Số điện thoại đã tồn tại!')
    }
    if(data.cccd && data.cccd !== guest.cccd){
        const existCccd = await prisma.guest.findUnique({
            where: {cccd: data.cccd}
        })
        if(existCccd) throw new Error('CCCD đã tồn tại!')
    }

    return prisma.guest.update({
        where: {id:id},
        data
    })
}

const deleteGuest = async(id:number)=>{
    const guest = await prisma.guest.findUnique({
        where: {id:id},
        include:{
            _count:{
                select:{
                    bookings: true
                }
            }
        }
    })
    if(!guest) throw new Error('Không tìm thấy khách hàng!')
    if(guest._count.bookings > 0){
        throw new Error('Không thể xoá khách hàng đã có booking!')
    }
    return prisma.guest.delete({where: {id:id}})
}

const searchGuests = async (keyword: string) => {
  return prisma.guest.findMany({
    where: {
      OR: [
        { fullName: { contains: keyword } },
        { phone: { contains: keyword } },
        { cccd: { contains: keyword } },
        { email: { contains: keyword } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
};
export default {getAllGuests,getGuestById,createGuest,updateGuest,deleteGuest,searchGuests}