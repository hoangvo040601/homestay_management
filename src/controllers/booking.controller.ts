import { Request, Response } from 'express';
import bookingSevices from '../services/booking.services';
import { sendError, sendSuccess } from '../utils/response';
import { getAuthUser, getParamId } from '../utils/request';

// Lấy danh sách booking
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query as {
      status?: string;
      date?: string;
    };
    const bookings = await bookingSevices.getAllBookings(status, date);
    sendSuccess(res, bookings);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
// Lấy booking theo id
const getBookingById = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const booking = await bookingSevices.getBookingById(id);
    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};
//tạo booking
const createBooking = async (req: Request, res: Response) => {
  try {
    const authUser = getAuthUser(req);
    const booking = await bookingSevices.createBooking(req.body, authUser.id);
    sendSuccess(res, booking, 'Tạo booking thành công!', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
// cập nhật booking
const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const booking = await bookingSevices.updateBooking(id, req.body);
    sendSuccess(res, booking, 'Cập nhật booking thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
// xác nhận booking
const confirmBooking = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const booking = await bookingSevices.confirmBooking(id);
    sendSuccess(res, booking, 'Xác nhận booking thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
// Check-in booking
const checkInBooking = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const booking = await bookingSevices.checkInBooking(id);
    sendSuccess(res, booking, 'Check-in booking thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
//check-out booking
const checkOutBooking = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const booking = await bookingSevices.checkOutBooking(id);
    sendSuccess(res, booking, 'Check-out booking thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
// Huỷ booking
const cancellBooking = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const booking = await bookingSevices.cancelBooking(id);
    sendSuccess(res, booking, 'Huỷ booking thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
export default {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  cancellBooking,
};
