import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'trevorosfintech@gmail.com' },
    update: { passwordHash: hash, role: 'ADMIN', name: 'Trevor Admin' },
    create: {
      email: 'trevorosfintech@gmail.com',
      passwordHash: hash,
      role: 'ADMIN',
      name: 'Trevor Admin',
    },
  });
  console.log('✅ Admin user ready:', user.email, '| Role:', user.role);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
