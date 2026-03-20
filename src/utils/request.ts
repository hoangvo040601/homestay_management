import { Request } from 'express';

export const getAuthUser = (req: Request) => {
  if (!req.user) throw new Error('Không có thông tin xác thực');
  return req.user;
};

export const getParamId = (req: Request): number => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) throw new Error('ID không hợp lệ');
  return id;
};