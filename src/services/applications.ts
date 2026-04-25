import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';
import { sendApplicationSubmittedEmail, sendApplicationAcceptedEmail, sendApplicationRejectedEmail } from './email';

export async function createApplication(userId: string, data: {
  track: 'FOUNDATION' | 'BUILDER';
  motivation: string;
  experience?: string;
  portfolio?: string;
  github?: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  batchDate?: string;
  phone?: string;
}) {
  // Check if user already has a pending or accepted application
  const existing = await prisma.application.findFirst({
    where: {
      userId,
      status: { in: ['PENDING', 'ACCEPTED'] },
    },
  });

  if (existing) {
    throw new AppError('You already have an active application', 409);
  }

  const application = await prisma.application.create({
    data: {
      userId,
      track: data.track,
      motivation: data.motivation,
      experience: data.experience,
      portfolio: data.portfolio,
      github: data.github,
      college: data.college,
      degree: data.degree,
      graduationYear: data.graduationYear,
      batchDate: data.batchDate,
      phone: data.phone,
    },
    include: { user: { select: { email: true, name: true } } },
  });

  // Fire-and-forget: send application submitted email
  sendApplicationSubmittedEmail(application.user.email, application.user.name, data.track).catch(console.error);

  return application;
}

export async function listApplications(filters?: {
  status?: string;
  track?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.track) where.track = filters.track;

  return prisma.application.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getApplicationById(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  return application;
}

export async function getApplicationsByUserId(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateApplicationStatus(id: string, data: {
  status: 'ACCEPTED' | 'REJECTED';
  adminNotes?: string;
}) {
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const updated = await prisma.application.update({
    where: { id },
    data: {
      status: data.status,
      adminNotes: data.adminNotes,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Fire-and-forget: send acceptance or rejection email
  if (data.status === 'ACCEPTED') {
    sendApplicationAcceptedEmail(updated.user.email, updated.user.name, updated.track).catch(console.error);
  } else if (data.status === 'REJECTED') {
    sendApplicationRejectedEmail(updated.user.email, updated.user.name, updated.track, data.adminNotes).catch(console.error);
  }

  return updated;
}
