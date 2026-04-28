import { Router } from 'express';
import { z } from 'zod';
import * as paymentsController from '../controllers/payments';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import { paymentLimiter, webhookLimiter } from '../middlewares/rateLimit';

const router = Router();

const createOrderSchema = z.object({
  amount: z.number().min(100, 'Amount must be at least 100 paise'),
});

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

router.post('/create-order', requireAuth, paymentLimiter, validate(createOrderSchema), paymentsController.createOrder);
router.post('/verify', requireAuth, validate(verifySchema), paymentsController.verifyPayment);
router.post('/webhook', webhookLimiter, paymentsController.webhook);
router.get('/all', requireAdmin, paymentsController.getAll);
router.get('/:userId', requireAuth, paymentsController.getByUser);

export default router;
