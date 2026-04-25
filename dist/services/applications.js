"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplication = createApplication;
exports.listApplications = listApplications;
exports.getApplicationById = getApplicationById;
exports.getApplicationsByUserId = getApplicationsByUserId;
exports.updateApplicationStatus = updateApplicationStatus;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errorHandler_1 = require("../middlewares/errorHandler");
const email_1 = require("./email");
async function createApplication(userId, data) {
    // Check if user already has a pending or accepted application
    const existing = await prisma_1.default.application.findFirst({
        where: {
            userId,
            status: { in: ['PENDING', 'ACCEPTED'] },
        },
    });
    if (existing) {
        throw new errorHandler_1.AppError('You already have an active application', 409);
    }
    const application = await prisma_1.default.application.create({
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
    (0, email_1.sendApplicationSubmittedEmail)(application.user.email, application.user.name, data.track).catch(console.error);
    return application;
}
async function listApplications(filters) {
    const where = {};
    if (filters?.status)
        where.status = filters.status;
    if (filters?.track)
        where.track = filters.track;
    return prisma_1.default.application.findMany({
        where,
        include: {
            user: {
                select: { id: true, name: true, email: true, phone: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function getApplicationById(id) {
    const application = await prisma_1.default.application.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, email: true, phone: true },
            },
        },
    });
    if (!application) {
        throw new errorHandler_1.AppError('Application not found', 404);
    }
    return application;
}
async function getApplicationsByUserId(userId) {
    return prisma_1.default.application.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
async function updateApplicationStatus(id, data) {
    const application = await prisma_1.default.application.findUnique({ where: { id } });
    if (!application) {
        throw new errorHandler_1.AppError('Application not found', 404);
    }
    const updated = await prisma_1.default.application.update({
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
        (0, email_1.sendApplicationAcceptedEmail)(updated.user.email, updated.user.name, updated.track).catch(console.error);
    }
    else if (data.status === 'REJECTED') {
        (0, email_1.sendApplicationRejectedEmail)(updated.user.email, updated.user.name, updated.track, data.adminNotes).catch(console.error);
    }
    return updated;
}
//# sourceMappingURL=applications.js.map