import { Request,Response } from 'express'
import paymentService from '../services/payment.service'
import { getParamId } from '../utils/request'
import { sendError, sendSuccess } from '../utils/response'


const getPaymentByBooking = async(req:Request, res:Response)=>{
    try {
        const bookingId = getParamId(req)
        const payment = await paymentService.getPaymentByBooking(bookingId)
        sendSuccess(res,payment)
    } catch (error:any) {
        sendError(res,error.message,404)        
    }
}

const getPaymentById = async(req:Request,res:Response)=>{
    try {
        const id = getParamId(req)
        const payment = await paymentService.getPaymentById(id)
        sendSuccess(res,payment)
    } catch (error:any) {
        sendError(res, error.messge, 404)
    }
}

const createPayment = async(req:Request, res:Response)=>{
    try {
        const payment = await paymentService.createPayment(req.body)
        sendSuccess(res,payment,'Thanh toán thành công!')
    } catch (error:any) {
        sendError(res,error.message,400)
    }
}
const updatePayment = async(req:Request, res:Response)=>{
    try {
        const id = getParamId(req)
        const payment = await paymentService.updatePayment(id, req.body)
        sendSuccess(res,payment,'Cập nhật thanh toán thành công!')
    } catch (error:any) {
        sendError(res, error.messgae, 400)
    }
}

const deletePayment = async(req:Request,res:Response)=>{
    try {
        const id = getParamId(req)
        await paymentService.deletePayment(id)
        sendSuccess(res, null, 'Xoá thanh toán thành công!')
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}

const getPaymentSummary = async(req:Request, res:Response)=>{
    try {
        const bookingId = getParamId(req)
        const payment = await paymentService.getPaymentSummary(bookingId)
        sendSuccess(res, payment)
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}
export default {getPaymentByBooking,getPaymentById,createPayment,updatePayment,deletePayment,getPaymentSummary}