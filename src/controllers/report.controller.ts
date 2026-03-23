import { Request,Response } from "express";
import reportService from '../services/report.service'
import { sendError, sendSuccess } from "../utils/response";


const getDashBoard = async(req:Request, res:Response)=>{
    try {
        const dashboad = await reportService.getDashBoard()
        sendSuccess(res, dashboad)
    } catch (error:any) {
        sendError(res, error.message, 500)
    }
}

const getRevenueReport = async(req:Request, res:Response)=>{
    try {
        const {from , to, } = req.query as{
            from: string,
            to: string,
        }
        if(!from || !to){
            return sendError(res, 'Vui lòng cung cấp ngày bắt đầu và kết thúc!')
        }
        const revenueReport = await reportService.getRevenueReport(from,to)
        sendSuccess(res, revenueReport)
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}

const getOccupancyReport  = async(req:Request, res:Response)=>{
    try {
        const {from , to, } = req.query as{
            from: string,
            to: string,
        }
        if(!from || !to){
            return sendError(res, 'Vui lòng cung cấp ngày bắt đầu và kết thúc!')
        }
        const occupancyReport = await reportService.getOccupancyReport(from, to)
        sendSuccess(res,occupancyReport)
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}

const getBookingReport = async(req:Request, res:Response)=>{
    try {
        const {from , to, } = req.query as{
            from: string,
            to: string,
        }
        if(!from || !to){
            return sendError(res, 'Vui lòng cung cấp ngày bắt đầu và kết thúc!')
        }
        const bookingReport = await reportService.getBookingReport(from, to)
        sendSuccess(res, bookingReport)
    } catch (error:any) {
        sendError(res, error.message, 400)
    }
}
export default {getDashBoard,getRevenueReport,getOccupancyReport,getBookingReport}