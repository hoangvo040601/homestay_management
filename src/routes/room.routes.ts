import { Router } from 'express';
import roomController from '../controllers/room.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createRoomSchema,
  createRoomTypeSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
  availableRoomsSchema,
} from '../validators/room.validator';

const router = Router();

router.use(authMiddleware);   // tất cả routes đều cần auth

// Room types
router.get('/types',       roomController.getAllRoomTypes);
router.post('/types',      requireRole('ADMIN'), validate(createRoomTypeSchema), roomController.createRoomType);
router.delete('/types/:id', requireRole('ADMIN'), roomController.deleteRoomType);

// Rooms
router.get('/available',   validate(availableRoomsSchema), roomController.getAvailableRooms);
router.get('/',            roomController.getAllRooms);
router.get('/:id',         roomController.getRoomById);
router.post('/',           requireRole('ADMIN'), validate(createRoomSchema), roomController.createRoom);
router.put('/:id',         requireRole('ADMIN'), validate(updateRoomSchema), roomController.updateRoom);
router.patch('/:id/status', requireRole('ADMIN'), validate(updateRoomStatusSchema), roomController.updateStatusRoom);
router.delete('/:id',      requireRole('ADMIN'), roomController.deleteRoom);

export default router;