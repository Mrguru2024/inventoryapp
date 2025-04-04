import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create test technician
    const techPassword = await hash('tech123', 12);
    const technician = await prisma.user.upsert({
      where: { email: 'tech@example.com' },
      update: {},
      create: {
        email: 'tech@example.com',
        name: 'Test Technician',
        password: techPassword,
        role: 'TECHNICIAN',
      },
    });

    // Create test customer
    const customerPassword = await hash('customer123', 12);
    const customer = await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        name: 'Test Customer',
        password: customerPassword,
        role: 'CUSTOMER',
      },
    });

    console.log({ admin, technician, customer });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 