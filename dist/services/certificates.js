"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificate = generateCertificate;
exports.verifyCertificate = verifyCertificate;
exports.getCertificatesByUser = getCertificatesByUser;
exports.getAllCertificates = getAllCertificates;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
function generateCertCode(track, sequence) {
    const year = new Date().getFullYear();
    const trackCode = track === 'BUILDER' ? 'BLD' : 'FND';
    return `TL-${trackCode}-${year}-${String(sequence).padStart(4, '0')}`;
}
function extractSequenceFromCode(code) {
    // Parse code like "TL-BLD-2025-0042" to get 42
    const parts = code.split('-');
    if (parts.length >= 4) {
        const seq = parseInt(parts[3], 10);
        return isNaN(seq) ? 0 : seq;
    }
    return 0;
}
async function generateCertificate(data) {
    // Get the last certificate to determine next sequence (avoids race condition from count())
    const lastCert = await prisma_1.default.certificate.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { code: true },
    });
    let nextSequence = 1;
    if (lastCert) {
        const lastSeq = extractSequenceFromCode(lastCert.code);
        nextSequence = lastSeq + 1;
    }
    const code = generateCertCode(data.programName.includes('Builder') ? 'BUILDER' : 'FOUNDATION', nextSequence);
    const certificate = await prisma_1.default.certificate.create({
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
async function verifyCertificate(code) {
    const certificate = await prisma_1.default.certificate.findUnique({
        where: { code },
        include: {
            user: { select: { id: true, name: true } },
        },
    });
    if (!certificate) {
        throw new errorHandler_1.AppError('Certificate not found', 404);
    }
    return certificate;
}
async function getCertificatesByUser(userId) {
    return prisma_1.default.certificate.findMany({
        where: { userId },
        orderBy: { issuedAt: 'desc' },
    });
}
async function getAllCertificates() {
    return prisma_1.default.certificate.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { issuedAt: 'desc' },
    });
}
//# sourceMappingURL=certificates.js.map