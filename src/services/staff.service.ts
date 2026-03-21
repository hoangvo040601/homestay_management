import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import {
  ChangePasswordDto,
  UpdateStaffDto,
} from '../validators/staff.validator';

const getAllStaff = async () => {
  const staff = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return staff;
};

const getStaffById = async (staffId: number) => {
  const staff = await prisma.user.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!staff) throw new Error('Không tìm thấy nhân viên!');
  return staff;
};

const updateStaff = async (staffId: number, data: UpdateStaffDto) => {
  const staff = await prisma.user.findUnique({
    where: { id: staffId },
  });
  if (!staff) throw new Error('Không tìm thấy nhân viên!');
  return prisma.user.update({
    where: { id: staffId },
    data: {
      name: data.name,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      updatedAt: true,
    },
  });
};
const toggleStaffStatus = async (staffId: number, isActive: boolean) => {
  const staff = await prisma.user.findUnique({
    where: { id: staffId },
  });
  if (!staff) throw new Error('Không tìm thấy nhân viên!');
  return prisma.user.update({
    where: { id: staffId },
    data: {
      isActive,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

const changePassword = async (staffId: number, data: ChangePasswordDto) => {
  const staff = await prisma.user.findUnique({
    where: { id: staffId },
  });
  if (!staff) throw new Error('Không tìm thấy nhân viên!');

  const isMatch = await bcrypt.compare(data.currentPassword, staff.password);
  if (!isMatch) throw new Error('Mật khẩu hiện tại không đúng!');

  const isSame = await bcrypt.compare(data.newPassword, staff.password);
  if (isSame) throw new Error('Mật khẩu mới không được trùng mật khẩu cũ!');

  const hashPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: staffId },
    data: { password: hashPassword },
  });

  //Xoá tất cả refresh token -> bắt đăng nhập lại
  await prisma.refreshToken.deleteMany({
    where: { userId: staffId },
  });
  return { message: 'Đổi mật khẩu thành công, vui lòng đăng nhập lại!' };
};

const deleteStaff = async (staffId: number, curentId: number) => {
  if (staffId === curentId)
    throw new Error('Không thể xoá tài khoản đang đăng nhập!');
  const staff = await prisma.user.findUnique({
    where: { id: staffId },
  });
  if (!staff) throw new Error('Không tìm thấy nhân viên!');
  // xoá mềm
  return prisma.user.update({
    where: { id: staffId },
    data: {
      isActive: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });
};
export default {
  getAllStaff,
  getStaffById,
  updateStaff,
  toggleStaffStatus,
  changePassword,
  deleteStaff,
};
