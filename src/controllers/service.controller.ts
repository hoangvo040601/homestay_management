import { Request, Response } from 'express';
import serviceServices from '../services/service.services';
import { sendError, sendSuccess } from '../utils/response';
import { getParamId } from '../utils/request';

//Lấy danh sách dịch vụ
const getServices = async (req: Request, res: Response) => {
  try {
    const services = await serviceServices.getAllServices();
    sendSuccess(res, services);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
//Lấy dịch vụ theo id
const getServiceById = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const service = await serviceServices.getServiceById(id);
    sendSuccess(res, service);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};
//Tạo dịch vụ
const createService = async (req: Request, res: Response) => {
  try {
    const service = await serviceServices.createService(req.body);
    sendSuccess(res, service, 'Tạo dịch vụ thành công!', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
//update dịch vụ
const updateService = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const service = await serviceServices.updateService(id, req.body);
    sendSuccess(res, service, 'Cập nhật dịch vụ thành công!');
  } catch (error: any) {
    sendError(res, error.mesage, 400);
  }
};
//Xoá dịch vụ
const deleteService = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const service = await serviceServices.deleteService(id);
    sendSuccess(res, null, 'Xoá dịch vụ thành công');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
//Xem danh sách dịch vụ booking
const getServiceBookings = async (req: Request, res: Response) => {
  try {
    const bookingId = getParamId(req);
    const serviceBooking = await serviceServices.getServiceBookings(bookingId);
    sendSuccess(res, serviceBooking);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
// Thêm dịch vụ cho booking
const addServiceToBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = getParamId(req);
    const serviceBooking = await serviceServices.addServiceToBooking(
      bookingId,
      req.body,
    );
    sendSuccess(
      res,
      serviceBooking,
      'Thêm dịch vụ cho booking thành công!',
      201,
    );
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
//Xoá dịch vụ từ booking
const deleteServiceFromBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = getParamId(req);
    const bookingServiceId = Number(req.params.serviceId);
    if (isNaN(bookingServiceId) || bookingServiceId <= 0) {
      return sendError(res, 'Service ID không hợp lệ!', 400);
    }
    const serviceBooking = await serviceServices.removeServiceFromBooking(
      bookingId,
      bookingServiceId,
    );
    sendSuccess(res, serviceBooking);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceBookings,
  addServiceToBooking,
  deleteServiceFromBooking,
};
