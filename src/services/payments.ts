import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { sendWelcomeEmail } from './email';

import * as razorpayLib from '../lib/razorpay';

export async function createPaymentOrder(userId: string, amount: number) {
  const order = await razorpayLib.createOrder(amount);
  const razorpayOrderId = order.id;

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      razorpayOrderId,
      status: 'PENDING',
    },
  });

  return { payment, razorpayOrderId };
}

export async function verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
    include: { user: true }
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  const isValid = razorpayLib.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    throw new AppError('Invalid payment signature', 400);
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId,
      status: 'COMPLETED',
    },
  });

  // Lookup track
  const application = await prisma.application.findFirst({
    where: { userId: payment.userId, status: 'ACCEPTED' },
  });
  const track = application ? application.track : 'FOUNDATION';

  // Dispatch the async welcome email
  sendWelcomeEmail(payment.user.email, payment.user.name, track).catch(console.error);

  return updatedPayment;
}

export async function getPaymentsByUser(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllPayments() {
  return prisma.payment.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
