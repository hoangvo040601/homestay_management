import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, error.message);
  sendError(res, error.message || 'Internal Server Error', 500);
};
