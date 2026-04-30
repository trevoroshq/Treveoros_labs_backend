import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@trevoros.com';
  const password = 'adminpassword123';
  const name = 'Super Admin';
  
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', passwordHash },
    create: { email, name, passwordHash, role: 'ADMIN' },
  });
  
  console.log('✅ Admin user created successfully:');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
