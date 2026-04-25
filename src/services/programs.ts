import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

export async function createProgram(data: {
  name: string;
  track: 'FOUNDATION' | 'BUILDER';
  description?: string;
  price: number;
  startDate: string;
  endDate: string;
  maxSeats?: number;
}) {
  return prisma.program.create({
    data: {
      name: data.name,
      track: data.track,
      description: data.description,
      price: data.price,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      maxSeats: data.maxSeats || 30,
    },
  });
}

export async function listPrograms() {
  return prisma.program.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      _count: { select: { enrollments: true } },
    },
  });
}

export async function updateProgram(id: string, data: Partial<{
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  maxSeats: number;
}>) {
  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) throw new AppError('Program not found', 404);

  return prisma.program.update({
    where: { id },
    data,
  });
}
