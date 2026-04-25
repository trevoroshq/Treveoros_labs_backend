import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Attempting to seed programs...');
  
  // Clear existing programs (optional but safe for dev)
  await prisma.program.deleteMany();

  const foundation = await prisma.program.create({
    data: {
      name: 'Foundation Cohort 1',
      track: 'FOUNDATION',
      description: 'The foundation track for beginners to learn web development basics.',
      price: 50000,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-01'),
      maxSeats: 50,
      isActive: true,
    }
  });

  const builder = await prisma.program.create({
    data: {
      name: 'Builder Cohort 1',
      track: 'BUILDER',
      description: 'The advanced track for building production-ready projects.',
      price: 150000,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-01'),
      maxSeats: 30,
      isActive: true,
    }
  });

  console.log('Programs seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
