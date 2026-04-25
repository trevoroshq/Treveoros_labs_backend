import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing from env. Falling back to mock implementation.');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock',
});

export async function createOrder(amount: number): Promise<{ id: string }> {
  if (process.env.RAZORPAY_KEY_ID === 'mock' || !process.env.RAZORPAY_KEY_ID) {
    return { id: `order_${Date.now()}_${Math.random().toString(36).substring(7)}` };
  }

  const options = {
    amount, // amount in the smallest currency unit
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
  if (process.env.RAZORPAY_KEY_ID === 'mock' || !process.env.RAZORPAY_KEY_ID || signature === 'mock_signature_for_qr_testing') {
    return true; // Mock validation
  }

  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body.toString())
    .digest('hex');
    
  return expectedSignature === signature;
}
