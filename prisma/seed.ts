import { PrismaClient } from '@prisma/client';
import { transponderSeedData } from './seeds/transponderData';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  try {
    // Clear existing data
    console.log('Clearing existing transponder data...');
    await prisma.transponderKey.deleteMany();
    
    // Seed new data with progress tracking
    console.log('Seeding transponder data...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const data of transponderSeedData) {
      try {
        await prisma.transponderKey.create({
          data: {
            make: data.make.toUpperCase(),
            model: data.model.toUpperCase(),
            yearStart: data.yearStart,
            yearEnd: data.yearEnd,
            transponderType: data.transponderType,
            chipType: data.chipType,
            compatibleParts: data.compatibleParts,
            frequency: data.frequency,
            notes: data.notes,
            dualSystem: data.dualSystem
          }
        });
        successCount++;
        console.log(`✓ Created transponder: ${data.make} ${data.model}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to create transponder: ${data.make} ${data.model}`, error);
      }
    }
    
    const count = await prisma.transponderKey.count();
    console.log(`\nSeeding completed:`);
    console.log(`- Successfully created: ${successCount} records`);
    console.log(`- Failed to create: ${errorCount} records`);
    console.log(`- Total records in database: ${count}`);
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