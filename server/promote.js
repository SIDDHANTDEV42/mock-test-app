import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function promote() {
  const email = process.argv[2];
  if (!email) {
    console.error('Please provide an email: node promote.js user@example.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', isGlobalAdmin: true }
    });
    console.log(`Successfully promoted ${user.email} to ADMIN.`);
  } catch (error) {
    console.error('Failed to promote user. Ensure the email is correct.');
  } finally {
    await prisma.$disconnect();
  }
}

promote();
