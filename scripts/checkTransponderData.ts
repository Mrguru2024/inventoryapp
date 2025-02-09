import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkTransponderData() {
  try {
    console.log('Fetching all transponder data...\n');
    
    const transponders = await prisma.transponderKey.findMany({
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
        { yearStart: 'asc' }
      ]
    });

    console.log(`Found ${transponders.length} transponder records\n`);

    transponders.forEach((transponder) => {
      console.log('----------------------------------------');
      console.log(`Make: ${transponder.make}`);
      console.log(`Model: ${transponder.model}`);
      console.log(`Years: ${transponder.yearStart}-${transponder.yearEnd || 'present'}`);
      console.log(`Transponder Type: ${transponder.transponderType}`);
      console.log(`Chip Types: ${transponder.chipType}`);
      console.log(`Compatible Parts: ${transponder.compatibleParts}`);
      console.log(`Frequency: ${transponder.frequency || 'N/A'}`);
      console.log(`Notes: ${transponder.notes || 'N/A'}`);
      console.log(`Dual System: ${transponder.dualSystem ? 'Yes' : 'No'}`);
      console.log('----------------------------------------\n');
    });

    // Summary statistics
    const makeCount = new Set(transponders.map(t => t.make)).size;
    const modelCount = new Set(transponders.map(t => t.model)).size;
    const transponderTypes = new Set(transponders.map(t => t.transponderType)).size;

    console.log('Summary:');
    console.log(`Total Makes: ${makeCount}`);
    console.log(`Total Models: ${modelCount}`);
    console.log(`Different Transponder Types: ${transponderTypes}`);

  } catch (error) {
    console.error('Error fetching transponder data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTransponderData(); 