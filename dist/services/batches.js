"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBatch = createBatch;
exports.updateBatch = updateBatch;
exports.listBatches = listBatches;
exports.getActiveBatch = getActiveBatch;
exports.deactivateBatch = deactivateBatch;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
// ─── Validation helpers ──────────────────────────────────────────────────────
const WHATSAPP_RE = /^https:\/\/chat\.whatsapp\.com\//;
function validateBatchInput(data) {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
        throw new errorHandler_1.AppError('End date must be after start date', 400);
    }
    if (!WHATSAPP_RE.test(data.whatsappLink)) {
        throw new errorHandler_1.AppError('WhatsApp link must start with https://chat.whatsapp.com/', 400);
    }
}
// ─── Create ──────────────────────────────────────────────────────────────────
async function createBatch(data) {
    validateBatchInput(data);
    return prisma_1.default.batch.create({
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
async function updateBatch(id, data) {
    const existing = await prisma_1.default.batch.findUnique({ where: { id } });
    if (!existing)
        throw new errorHandler_1.AppError('Batch not found', 404);
    // Merge with existing for cross-field validation
    const merged = {
        name: data.name ?? existing.name,
        track: data.track ?? existing.track,
        startDate: data.startDate ?? existing.startDate.toISOString(),
        endDate: data.endDate ?? existing.endDate.toISOString(),
        whatsappLink: data.whatsappLink ?? existing.whatsappLink,
    };
    validateBatchInput(merged);
    return prisma_1.default.batch.update({
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
async function listBatches() {
    return prisma_1.default.batch.findMany({
        orderBy: { startDate: 'desc' },
        include: { _count: { select: { enrollments: true } } },
    });
}
// ─── Get active batch for a track ────────────────────────────────────────────
async function getActiveBatch(track) {
    const now = new Date();
    return prisma_1.default.batch.findFirst({
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
async function deactivateBatch(id) {
    const existing = await prisma_1.default.batch.findUnique({ where: { id } });
    if (!existing)
        throw new errorHandler_1.AppError('Batch not found', 404);
    return prisma_1.default.batch.update({
        where: { id },
        data: { isActive: false },
    });
}
//# sourceMappingURL=batches.js.map