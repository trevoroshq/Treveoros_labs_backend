"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = getLeaderboard;
exports.updatePerformance = updatePerformance;
exports.getPerformanceByUser = getPerformanceByUser;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function getLeaderboard() {
    const scores = await prisma_1.default.performanceScore.groupBy({
        by: ['userId'],
        _sum: { totalScore: true },
        orderBy: { _sum: { totalScore: 'desc' } },
        take: 20,
    });
    const userIds = scores.map(s => s.userId);
    const users = await prisma_1.default.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
    });
    const enrollments = await prisma_1.default.enrollment.findMany({
        where: { userId: { in: userIds } },
        include: { program: { select: { track: true } } },
    });
    return scores.map((score, index) => {
        const user = users.find(u => u.id === score.userId);
        const enrollment = enrollments.find(e => e.userId === score.userId);
        return {
            rank: index + 1,
            userId: score.userId,
            name: user?.name || 'Unknown',
            email: user?.email,
            track: enrollment?.program?.track || 'FOUNDATION',
            totalScore: score._sum.totalScore || 0,
        };
    });
}
async function updatePerformance(userId, data) {
    const totalScore = (data.projectScore || 0) + (data.quizScore || 0) + (data.participationScore || 0);
    return prisma_1.default.performanceScore.upsert({
        where: { userId_weekNumber: { userId, weekNumber: data.weekNumber } },
        create: {
            userId,
            weekNumber: data.weekNumber,
            projectScore: data.projectScore || 0,
            quizScore: data.quizScore || 0,
            participationScore: data.participationScore || 0,
            totalScore,
        },
        update: {
            projectScore: data.projectScore,
            quizScore: data.quizScore,
            participationScore: data.participationScore,
            totalScore,
        },
    });
}
async function getPerformanceByUser(userId) {
    return prisma_1.default.performanceScore.findMany({
        where: { userId },
        orderBy: { weekNumber: 'asc' },
    });
}
//# sourceMappingURL=performance.js.map