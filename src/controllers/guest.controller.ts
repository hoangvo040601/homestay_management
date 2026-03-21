import { Request, Response } from 'express';
import guestSevices from '../services/guest.services'
import { sendError, sendSuccess } from '../utils/response';

// Lấy dang sách khách hàng
const getAllGuests = async(req:Request, res:Response)=>{
    try {
        const guest = await guestSevices.getAllGuests();
        sendSuccess(res, guest)
    } catch (error:any) {
        sendError(res, error.mesage, 500)
    }
}
//Lấy thông tin 1 khách hàng
const getGuest = async(req:Request, res:Response)=>{
    try {
        const guest = await guestSevices.getGuestById(Number(req.params.id))
        sendSuccess(res, guest)
    } catch (error:any) {
        sendError(res, error.message, 404)
    }
}
// Tạo thông tin khách hàng
const createGuest = async(req:Request, res:Response)=>{
    try {
        const guest = await guestSevices.createGuest(req.body)
        sendSuccess(res, guest, 'Tạo khách hàng thành công!', 201)
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}
// cập nhật thông tin khách hàng
const updateGuest = async(req:Request, res:Response)=>{
    try {
        const guest = await guestSevices.updateGuest(Number(req.params.id),req.body)
        sendSuccess(res, guest, 'Cập nhật khách hàng thành công!')
    } catch (error:any) {
        sendError(res,error.message, 400)
    }
}
// Xoá khách hàng
const deleteGuest = async(req:Request, res:Response)=>{
    try {
        const guest = await guestSevices.deleteGuest(Number(req.params.id))
        sendSuccess(res, null, 'Xoá khách hàng thành công!')
    } catch (error:any) {
        sendError(res, error.mesage, 400)
    }
}
// Tìm kiếm khách hàng
const searchGuest = async(req:Request, res:Response)=>{
    try {
        const {keyword} = req.query as {keyword: string}
        const guest = await guestSevices.searchGuests(keyword)
        sendSuccess(res,guest)
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}
export default {getAllGuests,getGuest,createGuest,updateGuest,deleteGuest,searchGuest}