import { PrismaClient } from '@prisma/client';
import { bmwTransponders } from './seeds/bmwTransponders';
import { hondaTransponders } from './seeds/hondaTransponders';
import { dodgeTransponders } from './seeds/dodgeTransponders';
import { subaruTransponders } from './seeds/subaruTransponders';
import { chevroletTransponders } from './seeds/chevroletTransponders';
import { chryslerTransponders } from './seeds/chryslerTransponders';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting seed...');

    // Verify database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Clear existing data
    await prisma.transponder.deleteMany();
    console.log('Cleared existing transponder data');

    // Combine all transponder data
    const allTransponders = [
      ...bmwTransponders,
      ...hondaTransponders,
      ...dodgeTransponders,
      ...subaruTransponders,
      ...chevroletTransponders,
      ...chryslerTransponders,
    ];

    console.log(`Preparing to seed ${allTransponders.length} transponders`);

    // Seed in batches
    const batchSize = 100;
    for (let i = 0; i < allTransponders.length; i += batchSize) {
      const batch = allTransponders.slice(i, i + batchSize);
      await prisma.transponder.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Seeded ${i + batch.length} of ${allTransponders.length} transponders`);
    }

    // Verify the data was seeded
    const count = await prisma.transponder.count();
    console.log(`Seed completed. Total transponders in database: ${count}`);

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  }); 