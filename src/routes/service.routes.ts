import { Router } from 'express';
import serviceRouter from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  addBookingSevicerSchema,
  createSevicerSchema,
  updateSevicerSchema,
} from '../validators/service.validator';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
router.use(authMiddleware);
//Service
router.get('/', serviceRouter.getServices);
router.get('/:id', serviceRouter.getServiceById);
router.post(
  '/',
  requireRole('ADMIN'),
  validate(createSevicerSchema),
  serviceRouter.createService,
);
router.put(
  '/:id',
  requireRole('ADMIN'),
  validate(updateSevicerSchema),
  serviceRouter.updateService,
);
router.delete(':id', requireRole('ADMIN'), serviceRouter.deleteService);
//Booking Services
router.get('/booking/:id', serviceRouter.getServiceBookings);
router.post(
  '/booking/:id',
  validate(addBookingSevicerSchema),
  serviceRouter.addServiceToBooking,
);
router.delete(
  '/booking/:id/:serviceId',
  serviceRouter.deleteServiceFromBooking,
);

export default router;
