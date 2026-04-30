"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnrollment = createEnrollment;
exports.getEnrollmentsByUser = getEnrollmentsByUser;
exports.getAllEnrollments = getAllEnrollments;
exports.updateEnrollmentStatus = updateEnrollmentStatus;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
const batches_1 = require("./batches");
const email_1 = require("./email");
async function createEnrollment(userId, programId) {
    const existing = await prisma_1.default.enrollment.findUnique({
        where: { userId_programId: { userId, programId } },
    });
    if (existing) {
        throw new errorHandler_1.AppError('Already enrolled in this program', 409);
    }
    // Verify user has completed payment
    const payment = await prisma_1.default.payment.findFirst({
        where: { userId, status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
    });
    if (!payment) {
        throw new errorHandler_1.AppError('Payment not completed. Please complete payment before enrolling.', 402);
    }
    // Determine which track the user applied for
    const application = await prisma_1.default.application.findFirst({
        where: { userId, status: 'ACCEPTED' },
        orderBy: { updatedAt: 'desc' },
    });
    const track = (application?.track ?? 'FOUNDATION');
    // Find the currently active batch for this track (may be null)
    const activeBatch = await (0, batches_1.getActiveBatch)(track);
    const enrollment = await prisma_1.default.enrollment.create({
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
    (0, email_1.sendEnrollmentBatchEmail)(enrollment.user.email, enrollment.user.name, track, activeBatch ?? null).catch(console.error);
    return enrollment;
}
async function getEnrollmentsByUser(userId) {
    return prisma_1.default.enrollment.findMany({
        where: { userId },
        include: { program: true },
        orderBy: { enrolledAt: 'desc' },
    });
}
async function getAllEnrollments() {
    return prisma_1.default.enrollment.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
            program: true,
        },
        orderBy: { enrolledAt: 'desc' },
    });
}
async function updateEnrollmentStatus(id, status) {
    return prisma_1.default.enrollment.update({
        where: { id },
        data: { status },
        include: {
            user: { select: { id: true, name: true, email: true } },
            program: true,
        },
    });
}
//# sourceMappingURL=enrollments.js.map