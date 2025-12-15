const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const EMAIL = 'admin@newsblogs.com';
const PASSWORD = 'Admin@1234';
const NAME = 'Admin';

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (existing) {
    console.log('User already exists with this email:', EMAIL);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.user.create({
    data: { email: EMAIL, password: hashed, name: NAME, role: 'admin' },
  });

  console.log('✅ Admin created:');
  console.log('Email:', user.email);
  console.log('Password:', PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });