import { validate } from './../middlewares/validate.middleware';
import { Router } from 'express';
import staffController from '../controllers/staff.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import {
  changePasswordSchema,
  toggleStaffSchema,
  updateStaffSchema,
} from '../validators/staff.validator';

const router = Router();

router.use(authMiddleware);

router.patch(
  '/change-password',
  validate(changePasswordSchema),
  staffController.changePassword,
);

router.get('/', requireRole('ADMIN'), staffController.getAllStaff);
router.get('/:id', requireRole('ADMIN'), staffController.getStaffById);
router.patch(
  '/:id/status',
  requireRole('ADMIN'),
  validate(toggleStaffSchema),
  staffController.toggleStaffStatus,
);
router.put(
  '/:id',
  requireRole('ADMIN'),
  validate(updateStaffSchema),
  staffController.updateStaff,
);
router.delete('/:id', requireRole('ADMIN'), staffController.deleteStaff);

export default router;
