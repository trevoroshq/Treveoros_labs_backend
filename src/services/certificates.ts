import prisma from '../lib/prisma';
import { AppError } from '../middlewares/errorHandler';

function generateCertCode(track: string, sequence: number): string {
  const year = new Date().getFullYear();
  const trackCode = track === 'BUILDER' ? 'BLD' : 'FND';
  return `TL-${trackCode}-${year}-${String(sequence).padStart(4, '0')}`;
}

function extractSequenceFromCode(code: string): number {
  // Parse code like "TL-BLD-2025-0042" to get 42
  const parts = code.split('-');
  if (parts.length >= 4) {
    const seq = parseInt(parts[3], 10);
    return isNaN(seq) ? 0 : seq;
  }
  return 0;
}

export async function generateCertificate(data: {
  userId: string;
  performance: 'EXCEPTIONAL' | 'STRONG' | 'SATISFACTORY';
  programName: string;
}) {
  // Get the last certificate to determine next sequence (avoids race condition from count())
  const lastCert = await prisma.certificate.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { code: true },
  });

  let nextSequence = 1;
  if (lastCert) {
    const lastSeq = extractSequenceFromCode(lastCert.code);
    nextSequence = lastSeq + 1;
  }

  const code = generateCertCode(data.programName.includes('Builder') ? 'BUILDER' : 'FOUNDATION', nextSequence);

  const certificate = await prisma.certificate.create({
    data: {
      userId: data.userId,
      code,
      performance: data.performance,
      programName: data.programName,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return certificate;
}

export async function verifyCertificate(code: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { code },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  if (!certificate) {
    throw new AppError('Certificate not found', 404);
  }

  return certificate;
}

export async function getCertificatesByUser(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: 'desc' },
  });
}

export async function getAllCertificates() {
  return prisma.certificate.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { issuedAt: 'desc' },
  });
}
