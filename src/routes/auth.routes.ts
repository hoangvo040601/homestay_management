import { Router } from 'express';
import  authController  from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

// Public
router.post('/login',   validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);               // ← không cần validate body nữa

// Protected
router.use(authMiddleware);
router.post('/logout', authController.logout);
router.get('/me',      authController.getMe);

// Admin only
router.post('/register', requireRole('ADMIN'), validate(registerSchema), authController.register);

export default router;