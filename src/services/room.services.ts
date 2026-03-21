import prisma from "../config/db"
import { CreateRoomDto, CreateRoomTypeDto, UpdateRoomDto } from "../validators/room.validator"


const getAllRoomTypes = async()=>{
    return await prisma.roomType.findMany({
        include: {_count: {select: {rooms: true}}},
        orderBy: {createdAt: 'asc'}
    }
    )
}

const createRoomType = async(data: CreateRoomTypeDto)=>{
    const existing = await prisma.roomType.findUnique({
        where: {
            name: data.name
        }
    });
    if(existing) throw new Error('Tên loại phòng đã tồn tại!');
    return prisma.roomType.create({
        data:{
            name: data.name,
            description: data.description,
            capacity: data.capacity,
            amenities: data.amenities? JSON.stringify(data.amenities): null
        },
    })
}

const deleteRoomType = async(id: number)=>{
    const roomType = await prisma.roomType.findUnique({
        where: {id:id},
        include:{
            _count: {select:{rooms:true}}
        }
    })
    if(!roomType) throw new Error('Không tìm thấy loại phòng!');
    if(roomType._count.rooms>0) throw new Error('Không thể xoá loại phòng đang có phòng!');

    return prisma.roomType.delete({
        where: {id:id}
    })
}


const getAllRooms = async()=>{
    return await prisma.room.findMany({
        include: {roomType:true},
        orderBy: {roomNumber: 'asc'}
    })
}

const getRoomById = async(id: number)=>{
    const room = await prisma.room.findUnique({
        where:{id:id},
        include: {roomType:true}
    })
    if(!room) throw new Error('Không tìm thấy phòng!');
    return room;
}

const createRoom = async(data: CreateRoomDto)=>{
    const room = await prisma.room.findUnique({
        where:{roomNumber: data.roomNumber}
    })
    if(room) throw new Error('Số phòng đã tồn tại!');

    const roomType = await prisma.roomType.findUnique({
        where:{id: data.roomTypeId}
    });
    if(!roomType) throw new Error('Loại phòng không tồn tại!');

    return prisma.room.create({
        data:{
            roomNumber: data.roomNumber,
            roomTypeId: data.roomTypeId,
            price: data.price,
            description: data.description,
            floor: data.floor,
        },
        include: {
            roomType: true
        }
    })
}

const updateRoom = async(id: number, data: UpdateRoomDto)=>{
    const room =await prisma.room.findUnique({
        where:{id:id}
    });
    if(!room) throw new Error('Không tìm thấy phòng!');
    if(data.roomNumber && data.roomNumber !== room.roomNumber){
        const exitsting = await prisma.room.findUnique({
            where:{
                roomNumber: data.roomNumber
            }
        })
        if(exitsting) throw new Error('Số phòng đã tồn tại!')
    }
    return prisma.room.update({
        where:{id: id},
        data:{
            roomNumber: data.roomNumber,
            roomTypeId: data.roomTypeId,
            price: data.price,
            description: data.description,
            floor: data.floor,
        },
        include: {roomType:true}
    })
}

const updateRoomStatus = async(id: number, status: string)=>{
    const room = await prisma.room.findUnique({
        where: {id:id}
    })
    if(!room) throw new Error('Không tìm thấy phòng!');

    return prisma.room.update({
        where: {id:id},
        data:{
            status: status as any,
        },
        include: {roomType: true}
    })
}

const deleteRoom = async(id: number)=>{
    const room = await prisma.room.findUnique({
        where: {id:id},
        include :{_count:{select:{bookings: true}}}
    });
    if(!room) throw new Error('Không tìm thấy phòng!');
    if(room._count.bookings>0) throw new Error('Không thể xoá phòng đã có bookings!');
    return prisma.room.delete({
        where: {id:id}
    })
}

const getAvalableRoom = async(checkin: string, checkout: string)=>{
    const checkInDate = new Date(checkin)
    const checkOutDate = new Date(checkout)
    if(checkInDate>checkOutDate) {
        throw new Error('Ngày check-out phải sau ngày check-in!')
    };

    return prisma.room.findMany({
        where:{
            status: 'AVAILABLE',
            bookings:{
                none:{
                    status:{notIn:['CANCELLED','CHECKED_OUT']},
                    AND:[
                        {checkIn: {lt: checkOutDate}},
                        {checkOut: {gt: checkInDate}}
                    ]
                }
            }
        },
        include :{
            roomType: true
        },
        orderBy: {roomNumber: 'asc'}
    })
}

export default {getAllRoomTypes,createRoomType,deleteRoomType,getAllRooms,getRoomById,
    createRoom,updateRoom,updateRoomStatus,deleteRoom,getAvalableRoom
}