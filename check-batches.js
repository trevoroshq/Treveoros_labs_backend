const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const batches = await prisma.batch.findMany();
  console.log('Current Batches in DB:', JSON.stringify(batches, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
