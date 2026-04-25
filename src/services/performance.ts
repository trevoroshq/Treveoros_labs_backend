import prisma from '../lib/prisma';

export async function getLeaderboard() {
  const scores = await prisma.performanceScore.groupBy({
    by: ['userId'],
    _sum: { totalScore: true },
    orderBy: { _sum: { totalScore: 'desc' } },
    take: 20,
  });

  const userIds = scores.map(s => s.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  const enrollments = await prisma.enrollment.findMany({
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

export async function updatePerformance(userId: string, data: {
  weekNumber: number;
  projectScore?: number;
  quizScore?: number;
  participationScore?: number;
}) {
  const totalScore = (data.projectScore || 0) + (data.quizScore || 0) + (data.participationScore || 0);

  return prisma.performanceScore.upsert({
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

export async function getPerformanceByUser(userId: string) {
  return prisma.performanceScore.findMany({
    where: { userId },
    orderBy: { weekNumber: 'asc' },
  });
}
