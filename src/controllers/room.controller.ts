import { Request ,Response} from 'express';
import roomSevices from '../services/room.services'
import { sendError, sendSuccess } from '../utils/response';

//Lấy tất cả loại phòng
const getAllRoomTypes = async(req: Request, res: Response)=>{
    try {
        const roomType = await roomSevices.getAllRoomTypes();
        sendSuccess(res,roomType)
    } catch (error:any) {
        sendError(res,error.message, 500);
    }
}
//Tạo loại phòng mới
const createRoomType = async(req: Request, res:Response)=>{
    try {
        const roomType = await roomSevices.createRoomType(req.body);
        sendSuccess(res,roomType,'Tạo loại phòng thành công!',201)
    } catch (error:any) {
        sendError(res,error.message,400)
    }

}
//Xoá loại phòng
const deleteRoomType = async(req:Request, res:Response)=>{
    try {
        const roomType = await roomSevices.deleteRoomType(Number(req.params.id));
        sendSuccess(res, null, 'Xoá loại phòng thành công!');
        
    } catch (error:any) {
        sendError(res,error.message, 400)
    }
}
// Lấy tất cả phòng
const getAllRooms = async(req:Request, res:Response)=>{
    try {
        const rooms = await roomSevices.getAllRooms();
        sendSuccess(res, rooms);
    } catch (error:any) {
        sendError(res, error.message, 500)
    }
}
//Lấy một phòng theo id
const getRoomById= async(req:Request, res:Response)=>{
    try {
        const room = await roomSevices.getRoomById(Number(req.params.id));
        sendSuccess(res, room)
    } catch (error:any) {
        sendError(res, error.message, 404)
    }
}
//tạo một phòng mới
const createRoom = async(req:Request, res:Response)=>{
    try {
        const room =await roomSevices.createRoom(req.body)
        sendSuccess(res, room, 'Tạo phòng thành công!', 201);
    } catch (error:any) {
        sendError(res, error.message, 400);
    }
}
// Cập nhật phòng
const updateRoom = async(req:Request, res:Response)=>{
    try {
        const room = await roomSevices.updateRoom(Number(req.params.id), req.body);
        sendSuccess(res, room, 'Cập nhật phòng thành công!');

    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}
// Cập nhật status phòng
const updateStatusRoom = async(req:Request, res:Response)=>{
    try {
        const room = await roomSevices.updateRoomStatus(Number(req.params.id), req.body.status);
        console.log('RAW room:', room);
    console.log('JSON room:', JSON.stringify(room));
        sendSuccess(res, room, 'Cập nhật trạng thái phòng thành công!');
    } catch (error:any) {
        sendError(res, error.messgae, 400)
    }
}
//Xoá phòng
const deleteRoom = async(req:Request, res:Response)=>{
    try {
        const room = await roomSevices.deleteRoom(Number(req.params.id))
        sendSuccess(res, null, 'Xoá phòng thành công!')
    } catch (error:any) {
        sendError(res,error.message, 400)
    }
}
//Xem trạng thái phòng
const getAvailableRooms = async(req:Request, res:Response)=>{
    try {
        const {checkIn, checkOut} = req.query as{
            checkIn: string,
            checkOut: string
        };
        const rooms= await roomSevices.getAvalableRoom(checkIn, checkOut );
        sendSuccess(res, rooms);
    } catch (error:any) {
        sendError(res, error.mesage, 400)
    }
}
export default {getAllRoomTypes,createRoomType,deleteRoomType,getAllRooms,getRoomById,createRoom,updateRoom,
    updateStatusRoom,deleteRoom,getAvailableRooms
}