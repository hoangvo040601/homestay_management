import { Router } from 'express'
import reportController from '../controllers/report.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'


const router = Router()
router.use(authMiddleware)
router.use(requireRole('ADMIN'))

router.get('/dashboard', reportController.getDashBoard)
router.get('/revenue', reportController.getRevenueReport)
router.get('/occupancy', reportController.getOccupancyReport)
router.get('/bookings', reportController.getBookingReport)

export default router