import { Router } from 'express'
import paymentController from '../controllers/payment.controller'
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPaymentSchema, updatePaymentschema } from '../validators/payment.validartor';
import { requireRole } from '../middlewares/role.middleware';


const router = Router();
router.use(authMiddleware);


router.get('/booking/:id', paymentController.getPaymentByBooking)
router.get('/booking/:id/summary', paymentController.getPaymentSummary)

router.get('/:id', paymentController.getPaymentById)
router.post('/',validate(createPaymentSchema), paymentController.createPayment)
router.patch('/:id',requireRole('ADMIN'),validate(updatePaymentschema),paymentController.updatePayment)
router.delete('/:id',requireRole('ADMIN'),paymentController.deletePayment)


export default router