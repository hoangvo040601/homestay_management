import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import {
  getRefreshTokenExpiry,
  LoginDto,
  RegisterDto,
} from '../validators/auth.validator';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

const login = async (data: LoginDto) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) throw new Error('Email hoặc mật khẩu không đúng!');
  if (!user.isActive) throw new Error('Tài khoản đã bị vô hiệu hoá!');

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng!');

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
      expiresAt: { lt: new Date() }, // chỉ xoá token đã hết hạn
    },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  };
};

const register = async (data: RegisterDto) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (user) throw new Error('Email đã tồn tại!');
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });
};

const refreshService = async (refreshToken: string) => {
  // 1. Verify chữ ký JWT
  const payload = verifyRefreshToken(refreshToken);

  // 2. Kiểm tra token tồn tại trong DB
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  // 3. Kiểm tra null trước — bao gồm cả trường hợp token không tồn tại
  if (!storedToken) {
    throw new Error('Refresh token không hợp lệ');
  }

  // 4. Từ đây TypeScript đã biết storedToken không null
  // Xác minh chéo payload với DB
  if (payload.id !== storedToken.userId) {
    throw new Error('Refresh token không hợp lệ');
  }

  // 5. Kiểm tra hết hạn
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new Error('Refresh token đã hết hạn, vui lòng đăng nhập lại');
  }

  // 6. Kiểm tra user còn active không
  if (!storedToken.user.isActive) {
    throw new Error('Tài khoản đã bị vô hiệu hoá');
  }

  // 7. Xoá token cũ (rotate)
  await prisma.refreshToken.delete({ where: { token: refreshToken } });

  // 8. Tạo cặp token mới
  const newPayload = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  };
  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  // 9. Lưu refreshToken mới
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: storedToken.user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (refreshtoken: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshtoken,
    },
  });
};
const getMeService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });
  if (!user) throw new Error('Không tìm thấy người dùng');
  return user;
};

export default { login, register, refreshService, logout, getMeService };
