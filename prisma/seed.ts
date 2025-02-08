const { PrismaClient } = require('@prisma/client');
import { audiTransponderData } from './seeds/audiTransponders';
import { TransponderKeyData } from '@/app/services/transponderService';
import { chevroletTransponderData } from './seeds/chevroletTransponders';
import { fiatTransponderData } from './seeds/fiatTransponders';
import { isuzuTransponderData } from './seeds/isuzuTransponders';
import { lexusTransponderData } from './seeds/lexusTransponders';
import { peugeotTransponderData } from './seeds/peugeotTransponders';
import { suzukiTransponderData } from './seeds/suzukiTransponders';
import { acuraTransponderData } from './seeds/acuraTransponders';
import { chryslerTransponderData } from './seeds/chryslerTransponders';

const prisma = new PrismaClient();

async function seedTransponderData(data: TransponderKeyData[]) {
  console.log('Seeding transponder data...');
  
  for (const transponder of data) {
    await prisma.transponderKey.upsert({
      where: {
        id: `${transponder.make}-${transponder.model}-${transponder.yearStart}`
      },
      update: transponder,
      create: transponder
    });
  }
}

async function main() {
  // Sample key data
  const sampleKeys = [
    {
      partNumber: "285E3-9DJ3B",
      year: "2019",
      make: "Nissan",
      model: "Maxima",
      fccId: "KR5TXN7",
      icNumber: "7812D-TXN7",
      continentalNumber: "S180144906",
      frequency: "433 MHz",
      battery: "CR2032",
      emergencyKey: "EKB-NIS-NI06",
      manufacturer: "KeylessFactory",
      buttons: JSON.stringify(["Lock", "Unlock", "Panic", "Remote Start", "Trunk"]),
      notes: "Aftermarket replacement key"
    },
    {
      partNumber: "HYQ14FBA",
      year: "2020",
      make: "Toyota",
      model: "Camry",
      fccId: "HYQ14FBA",
      icNumber: "7812A-14FBA",
      continentalNumber: "S180144907",
      frequency: "433.92 MHz",
      battery: "CR2032",
      emergencyKey: "TOY-44D",
      manufacturer: "KeylessFactory",
      buttons: JSON.stringify(["Lock", "Unlock", "Panic", "Trunk"]),
      notes: "OEM replacement key"
    },
    {
      partNumber: "KR5V2X",
      year: "2021",
      make: "Honda",
      model: "Civic",
      fccId: "KR5V2X",
      icNumber: "7812D-V2X",
      continentalNumber: "S180144908",
      frequency: "433.92 MHz",
      battery: "CR2032",
      emergencyKey: "HON-R62",
      manufacturer: "KeylessFactory",
      buttons: JSON.stringify(["Lock", "Unlock", "Panic", "Remote Start"]),
      notes: "Aftermarket replacement key"
    }
  ];

  console.log('Start seeding...');
  
  for (const key of sampleKeys) {
    const createdKey = await prisma.key.upsert({
      where: { partNumber: key.partNumber },
      update: key,
      create: key,
    });
    console.log(`Created key with part number: ${createdKey.partNumber}`);
  }

  console.log('Seeding Audi transponder data...');
  await seedTransponderData(audiTransponderData);
  
  console.log('Seeding Chevrolet transponder data...');
  await seedTransponderData(chevroletTransponderData);
  
  console.log('Seeding FIAT transponder data...');
  await seedTransponderData(fiatTransponderData);
  
  console.log('Seeding ISUZU transponder data...');
  await seedTransponderData(isuzuTransponderData);
  
  console.log('Seeding LEXUS transponder data...');
  await seedTransponderData(lexusTransponderData);
  
  console.log('Seeding PEUGEOT transponder data...');
  await seedTransponderData(peugeotTransponderData);
  
  console.log('Seeding SUZUKI transponder data...');
  await seedTransponderData(suzukiTransponderData);
  
  console.log('Seeding ACURA transponder data...');
  await seedTransponderData(acuraTransponderData);
  
  console.log('Seeding CHRYSLER transponder data...');
  await seedTransponderData(chryslerTransponderData);
  
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 