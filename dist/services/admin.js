"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = getAdminStats;
exports.getAllUsers = getAllUsers;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function getAdminStats() {
    const [totalApplications, pendingApplications, acceptedApplications, rejectedApplications, totalPayments, completedPayments, totalEnrollments, activeEnrollments, totalCertificates, totalUsers,] = await Promise.all([
        prisma_1.default.application.count(),
        prisma_1.default.application.count({ where: { status: 'PENDING' } }),
        prisma_1.default.application.count({ where: { status: 'ACCEPTED' } }),
        prisma_1.default.application.count({ where: { status: 'REJECTED' } }),
        prisma_1.default.payment.count(),
        prisma_1.default.payment.count({ where: { status: 'COMPLETED' } }),
        prisma_1.default.enrollment.count(),
        prisma_1.default.enrollment.count({ where: { status: 'ACTIVE' } }),
        prisma_1.default.certificate.count(),
        prisma_1.default.user.count(),
    ]);
    // Calculate total revenue from completed payments
    const revenueResult = await prisma_1.default.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
    });
    const totalRevenue = revenueResult._sum.amount || 0;
    // Recent activity
    const recentApplications = await prisma_1.default.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
    });
    const recentPayments = await prisma_1.default.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
    });
    // Build activity feed
    const activities = [
        ...recentApplications.map(a => ({
            action: a.status === 'PENDING' ? 'New application' : `Application ${a.status.toLowerCase()}`,
            user: a.user.name,
            time: a.createdAt.toISOString(),
            type: 'application',
        })),
        ...recentPayments.map(p => ({
            action: p.status === 'COMPLETED' ? 'Payment received' : 'Payment pending',
            user: p.user.name,
            time: p.createdAt.toISOString(),
            type: 'payment',
        })),
    ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10);
    return {
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        totalPayments,
        completedPayments,
        totalEnrollments,
        activeEnrollments,
        totalCertificates,
        totalUsers,
        totalRevenue,
        activities,
    };
}
async function getAllUsers() {
    return prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            applications: { select: { status: true, track: true } },
            payments: { select: { status: true, amount: true } },
            enrollments: { select: { status: true, program: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
    });
}
//# sourceMappingURL=admin.js.map