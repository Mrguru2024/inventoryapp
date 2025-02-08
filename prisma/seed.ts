import { PrismaClient } from '@prisma/client';
import { transponderSeedData } from './seeds/transponderData';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  try {
    // Clear existing data
    console.log('Clearing existing transponder data...');
    await prisma.transponderKey.deleteMany();
    
    // Seed new data
    console.log('Seeding transponder data...');
    for (const data of transponderSeedData) {
      await prisma.transponderKey.create({
        data: {
          make: data.make.toUpperCase(),
          model: data.model.toUpperCase(),
          yearStart: data.yearStart,
          yearEnd: data.yearEnd,
          transponderType: data.transponderType,
          chipType: data.chipType,
          compatibleParts: data.compatibleParts,
          notes: data.notes,
          dualSystem: data.dualSystem
        }
      });
      console.log(`Created transponder: ${data.make} ${data.model}`);
    }
    
    const count = await prisma.transponderKey.count();
    console.log(`Seeding completed. Created ${count} transponder records.`);
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 