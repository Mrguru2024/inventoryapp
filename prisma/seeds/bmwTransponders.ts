import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedBMWTransponders() {
  const bmwData = [
    {
      make: "BMW",
      model: "1-Series",
      yearStart: 2004,
      yearEnd: 2006,
      transponderType: "Philips Crypto 2",
      chipType: JSON.stringify(["ID46", "PCF7936AS"]),
      compatibleParts: JSON.stringify(["66126986582", "66129268489", "66129268488"]),
      frequency: "433 MHz",
      notes: "BMW CAS2 system",
      dualSystem: false,
    },
    {
      make: "BMW",
      model: "1-Series",
      yearStart: 2007,
      yearEnd: 2010,
      transponderType: "Philips Crypto 2",
      chipType: JSON.stringify(["ID46", "PCF7945", "PCF7936"]),
      compatibleParts: JSON.stringify(["5WK49145", "5WK49146", "5WK49147", "66126986583", "66129268488"]),
      frequency: "433 MHz",
      notes: "CAS3, CAS3+ systems",
      dualSystem: false,
    },
    // Add all BMW car models...
    {
      make: "BMW",
      model: "R1200GS",
      yearStart: 2005,
      yearEnd: 2011,
      transponderType: "Philips Crypto 2",
      chipType: JSON.stringify(["ID46", "PCF7936"]),
      compatibleParts: JSON.stringify(["Silca T14", "JMA TP12"]),
      frequency: "433 MHz",
      notes: "Motorcycle System",
      dualSystem: false,
    },
    // Add all BMW motorcycle models...
  ];

  console.log('Starting BMW transponder data seeding...');

  for (const data of bmwData) {
    try {
      await prisma.transponderKey.create({
        data: {
          ...data,
          id: undefined, // Let Prisma generate the ID
          createdAt: undefined, // Let Prisma set the timestamp
          updatedAt: undefined, // Let Prisma set the timestamp
        },
      });
      console.log(`Added transponder data for ${data.make} ${data.model} ${data.yearStart}-${data.yearEnd || 'present'}`);
    } catch (error) {
      console.error(`Error adding transponder for ${data.make} ${data.model}:`, error);
    }
  }

  console.log('BMW transponder data seeding completed');
}

seedBMWTransponders()
  .catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 