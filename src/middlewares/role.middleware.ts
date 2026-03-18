import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const requireRole = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Chưa xác thực', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Không có quyền truy cập', 403);
    }
    next();
  };

// Dùng như:
// requireRole('ADMIN')
// requireRole('ADMIN', 'STAFF')