import { Request, Response, NextFunction } from 'express';
import * as paymentsService from '../services/payments';

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount } = req.body;
    const result = await paymentsService.createPaymentOrder(req.user!.id, amount);
    res.status(201).json({ message: 'Order created', ...result });
  } catch (error) {
    next(error);
  }
}

// Called by frontend after Razorpay checkout succeeds (with signature)
export async function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const payment = await paymentsService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    res.json({ message: 'Payment verified', payment });
  } catch (error) {
    next(error);
  }
}

// Razorpay server-to-server webhook (signature verification required)
export async function webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Signature must be present and non-empty
    if (!razorpay_signature || typeof razorpay_signature !== 'string' || razorpay_signature.trim() === '') {
      res.status(400).json({ message: 'Missing or invalid signature' });
      return;
    }
    
    const payment = await paymentsService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    res.json({ message: 'Webhook processed', payment });
  } catch (error) {
    next(error);
  }
}

export async function getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId as string;
    // Authorization: Users can only view their own payment history
    if (userId !== req.user!.id) {
      res.status(403).json({ message: 'Cannot view other users\' payment history' });
      return;
    }
    const payments = await paymentsService.getPaymentsByUser(userId);
    res.json({ payments });
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payments = await paymentsService.getAllPayments();
    res.json({ payments });
  } catch (error) {
    next(error);
  }
}
