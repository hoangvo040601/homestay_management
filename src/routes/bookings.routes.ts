import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import bookingController from '../controllers/booking.controller'
import {validate} from '../middlewares/validate.middleware'
import { createBookingSchema, filterBookingSchema, updateBookingSchema } from "../validators/booking.validator";



const router = Router();


router.use(authMiddleware)
router.get('/',validate(filterBookingSchema), bookingController.getAllBookings)
router.get('/:id', bookingController.getBookingById)
router.post('/', validate(createBookingSchema), bookingController.createBooking)
router.put('/:id',validate(updateBookingSchema), bookingController.updateBooking)
router.patch('/:id/confirm', bookingController.confirmBooking)
router.patch('/:id/checkin', bookingController.checkInBooking)
router.patch('/:id/checkout', bookingController.checkOutBooking)
router.patch('/:id/cancel', bookingController.cancellBooking)


export default router
