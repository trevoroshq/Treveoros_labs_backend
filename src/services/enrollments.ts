import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { getActiveBatch } from './batches';
import { sendEnrollmentBatchEmail } from './email';

export async function createEnrollment(userId: string, programId: string) {
  const existing = await prisma.enrollment.findUnique({
    where: { userId_programId: { userId, programId } },
  });

  if (existing) {
    throw new AppError('Already enrolled in this program', 409);
  }

  // Verify user has completed payment
  const payment = await prisma.payment.findFirst({
    where: { userId, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
  });

  if (!payment) {
    throw new AppError('Payment not completed. Please complete payment before enrolling.', 402);
  }

  // Determine which track the user applied for
  const application = await prisma.application.findFirst({
    where: { userId, status: 'ACCEPTED' },
    orderBy: { updatedAt: 'desc' },
  });
  const track = (application?.track ?? 'FOUNDATION') as 'FOUNDATION' | 'BUILDER';

  // Find the currently active batch for this track (may be null)
  const activeBatch = await getActiveBatch(track);

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      programId,
      ...(activeBatch ? { batchId: activeBatch.id } : {}),
    },
    include: {
      program: true,
      user: { select: { id: true, name: true, email: true } },
      batch: true,
    },
  });

  // Fire-and-forget batch details email
  sendEnrollmentBatchEmail(
    enrollment.user.email,
    enrollment.user.name,
    track,
    activeBatch ?? null,
  ).catch(console.error);

  return enrollment;
}

export async function getEnrollmentsByUser(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { program: true },
    orderBy: { enrolledAt: 'desc' },
  });
}

export async function getAllEnrollments() {
  return prisma.enrollment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      program: true,
    },
    orderBy: { enrolledAt: 'desc' },
  });
}

export async function updateEnrollmentStatus(id: string, status: 'ACTIVE' | 'COMPLETED' | 'DROPPED') {
  return prisma.enrollment.update({
    where: { id },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      program: true,
    },
  });
}
