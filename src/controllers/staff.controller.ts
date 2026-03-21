import { Request, Response } from 'express';
import staffService from '../services/staff.service';
import { sendError, sendSuccess } from '../utils/response';
import { getAuthUser, getParamId } from '../utils/request';

const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staffs = await staffService.getAllStaff();
    sendSuccess(res, staffs);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const getStaffById = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const staff = await staffService.getStaffById(id);
    sendSuccess(res, staff);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

const updateStaff = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const staff = await staffService.updateStaff(id, req.body);
    sendSuccess(res, staff, 'Cập nhật thông tin thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

const toggleStaffStatus = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const { isActive } = req.body;
    const staff = await staffService.toggleStaffStatus(id, isActive);
    const message = isActive
      ? 'Kích hoạt tài khoản thành công!'
      : 'Vô hiệu hoá tài khoản thành công!';
    sendSuccess(res, staff, message);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const authUser = getAuthUser(req);
    const result = await staffService.changePassword(authUser.id, req.body);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

const deleteStaff = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const authUser = getAuthUser(req);
    const staff = await staffService.deleteStaff(id, authUser.id);
    sendSuccess(res, staff, 'Vô hiệu hoá tài khoản thành công!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export default {
  getAllStaff,
  getStaffById,
  updateStaff,
  toggleStaffStatus,
  changePassword,
  deleteStaff,
};
