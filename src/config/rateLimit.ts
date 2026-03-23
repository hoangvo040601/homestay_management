import rateLimit from 'express-rate-limit';

// Rate limit chung cho tất cả API
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 phút
  max: 100,                   // tối đa 100 request/15 phút
  message: {
    success: false,
    message: 'Quá nhiều request, vui lòng thử lại sau 15 phút',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit riêng cho Auth — chặt hơn
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 phút
  max: 10,                    // tối đa 10 request/15 phút
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập, vui lòng thử lại sau 15 phút',
  },
  standardHeaders: true,
  legacyHeaders: false,
});