import { Response, Request } from 'express';
import authSevices from '../services/auth.services';
import {
  clearRefreshTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../config/cookie';
import { sendError, sendSuccess } from '../utils/response';

const login = async (req: Request, res: Response) => {
  try {
    const result = await authSevices.login(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);
    sendSuccess(
      res,
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      'Đăng nhập thành công',
    );
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const user = await authSevices.register(req.body);
    sendSuccess(res, user, 'Tạo tài khoản thành công!', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return sendError(res, 'Không tìm thấy refresh token', 401);
    }
    const result = await authSevices.refreshService(refreshToken);
    res.cookie('refreshToken', result.refreshToken, refreshTokenCookieOptions);
    sendSuccess(
      res,
      { accessToken: result.accessToken },
      'Làm mới token thành công',
    );
  } catch (error: any) {
    res.clearCookie('refreshToken', clearRefreshTokenCookieOptions);
    sendError(res, error.message, 401);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await authSevices.logout(refreshToken);
    }
    res.clearCookie('refreshToken', clearRefreshTokenCookieOptions);
    sendSuccess(res, null, 'Đăng xuất thành công');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = await authSevices.getMeService(req.user!.id);
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

export default { login, register, refresh, logout, getMe };
