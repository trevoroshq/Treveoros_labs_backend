import prisma from '../lib/prisma';

export async function getAdminStats() {
  const [
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
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: 'PENDING' } }),
    prisma.application.count({ where: { status: 'ACCEPTED' } }),
    prisma.application.count({ where: { status: 'REJECTED' } }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: 'COMPLETED' } }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.certificate.count(),
    prisma.user.count(),
  ]);

  // Calculate total revenue from completed payments
  const revenueResult = await prisma.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });

  const totalRevenue = revenueResult._sum.amount || 0;

  // Recent activity
  const recentApplications = await prisma.application.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
  });

  const recentPayments = await prisma.payment.findMany({
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
      type: 'application' as const,
    })),
    ...recentPayments.map(p => ({
      action: p.status === 'COMPLETED' ? 'Payment received' : 'Payment pending',
      user: p.user.name,
      time: p.createdAt.toISOString(),
      type: 'payment' as const,
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

export async function getAllUsers() {
  return prisma.user.findMany({
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
