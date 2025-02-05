const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create or update admin user
    const hashedPassword = await hash('Test1234', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: '5epmgllc@gmail.com' },
      update: {
        role: 'ADMIN',
        emailVerified: new Date(),
      },
      create: {
        email: '5epmgllc@gmail.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('Admin user updated:', adminUser);
  } catch (error) {
    console.error('Seed error:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 