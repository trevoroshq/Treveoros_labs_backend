import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

// ─── Validation helpers ──────────────────────────────────────────────────────

const WHATSAPP_RE = /^https:\/\/chat\.whatsapp\.com\//;

function validateBatchInput(data: {
  name: string;
  track: string;
  startDate: string;
  endDate: string;
  whatsappLink: string;
}) {
  if (new Date(data.endDate) <= new Date(data.startDate)) {
    throw new AppError('End date must be after start date', 400);
  }
  if (!WHATSAPP_RE.test(data.whatsappLink)) {
    throw new AppError(
      'WhatsApp link must start with https://chat.whatsapp.com/',
      400,
    );
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createBatch(data: {
  name: string;
  track: 'FOUNDATION' | 'BUILDER';
  startDate: string;
  endDate: string;
  whatsappLink: string;
  isActive?: boolean;
}) {
  validateBatchInput(data);

  return prisma.batch.create({
    data: {
      name: data.name,
      track: data.track,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      whatsappLink: data.whatsappLink,
      isActive: data.isActive ?? true,
    },
    include: { _count: { select: { enrollments: true } } },
  });
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateBatch(
  id: string,
  data: {
    name?: string;
    track?: 'FOUNDATION' | 'BUILDER';
    startDate?: string;
    endDate?: string;
    whatsappLink?: string;
    isActive?: boolean;
  },
) {
  const existing = await prisma.batch.findUnique({ where: { id } });
  if (!existing) throw new AppError('Batch not found', 404);

  // Merge with existing for cross-field validation
  const merged = {
    name: data.name ?? existing.name,
    track: data.track ?? existing.track,
    startDate: data.startDate ?? existing.startDate.toISOString(),
    endDate: data.endDate ?? existing.endDate.toISOString(),
    whatsappLink: data.whatsappLink ?? existing.whatsappLink,
  };
  validateBatchInput(merged);

  return prisma.batch.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.track && { track: data.track }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.whatsappLink && { whatsappLink: data.whatsappLink }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: { _count: { select: { enrollments: true } } },
  });
}

// ─── List ────────────────────────────────────────────────────────────────────

export async function listBatches() {
  return prisma.batch.findMany({
    orderBy: { startDate: 'desc' },
    include: { _count: { select: { enrollments: true } } },
  });
}

// ─── Get active batch for a track ────────────────────────────────────────────

export async function getActiveBatch(track: 'FOUNDATION' | 'BUILDER') {
  const now = new Date();
  return prisma.batch.findFirst({
    where: {
      track,
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { startDate: 'asc' },
  });
}

// ─── Soft deactivate ─────────────────────────────────────────────────────────

export async function deactivateBatch(id: string) {
  const existing = await prisma.batch.findUnique({ where: { id } });
  if (!existing) throw new AppError('Batch not found', 404);

  return prisma.batch.update({
    where: { id },
    data: { isActive: false },
  });
}
