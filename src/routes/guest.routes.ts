import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import guestController from '../controllers/guest.controller'
import { requireRole } from "../middlewares/role.middleware";
import {
  createGuestSchema,
  updateGuestSchema,
  searchGuestSchema,
} from '../validators/guest.validator';
import { validate } from "../middlewares/validate.middleware";



const router = Router()
router.use(authMiddleware)



router.get('/search', validate(searchGuestSchema),guestController.searchGuest)
router.get('/', guestController.getAllGuests)
router.get('/:id', guestController.getGuest)
router.post('/', validate(createGuestSchema) ,guestController.createGuest)
router.put('/:id', validate(updateGuestSchema),guestController.updateGuest)
router.delete('/:id',requireRole('ADMIN'),guestController.deleteGuest)


export default router