import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing from env. Payments will not work.');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'missing',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'missing',
});

export async function createOrder(amount: number): Promise<{ id: string }> {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'missing') {
    throw new Error('Razorpay configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
  }

  const options = {
    amount, // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (err) {
    console.error('Failed to create Razorpay order', err);
    throw new Error('Payment gateway error. Please try again.');
  }
}

export function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  // In production, NEVER skip signature verification
  if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'missing') {
    console.error('Razorpay secret key not configured. Cannot verify signature.');
    throw new Error('Payment verification failed. Configuration error.');
  }

  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  
  const isValid = expectedSignature === signature;
  
  if (!isValid) {
    console.error('Invalid payment signature. Order:', orderId, 'Payment:', paymentId);
  }
  
  return isValid;
}
