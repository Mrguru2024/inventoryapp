import { PrismaClient } from "@prisma/client";
import { bmwTransponderData } from "./seeds/bmwTransponders";
import { acuraTransponderData } from "./seeds/acuraTransponders";
import { chevroletTransponderData } from "./seeds/chevroletTransponders";
import { fordTransponderData } from "./seeds/fordTransponders";
import { hondaTransponderData } from "./seeds/hondaTransponders";
import { toyotaTransponderData } from "./seeds/toyotaTransponders";
import { volkswagenTransponderData } from "./seeds/volkswagenTransponders";
import { hyundaiTransponderData } from "./seeds/hyundaiTransponders";
import { kiaTransponderData } from "./seeds/kiaTransponders";
import { nissanTransponderData } from "./seeds/nissanTransponders";
import { audiTransponderData } from "./seeds/audiTransponders";
import { suzukiTransponderData } from "./seeds/suzukiTransponders";
import { fiatTransponderData } from "./seeds/fiatTransponders";
import { isuzuTransponderData } from "./seeds/isuzuTransponders";
import { peugeotTransponderData } from "./seeds/peugeotTransponders";
import { chryslerTransponderData } from "./seeds/chryslerTransponders";
import { lexusTransponderData } from "./seeds/lexusTransponders";
import { subaruTransponderData } from "./seeds/subaruTransponders";
import { landRoverTransponderData } from "./seeds/landRoverTransponders";
import { dodgeTransponderData } from "./seeds/dodgeTransponders";
import { transponderUpdates2022 } from "./seeds/transponderUpdates2022";
import { buickTransponderData } from "./seeds/buickTransponders";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  try {
    // Clear existing data
    console.log("Clearing existing transponder data...");
    await prisma.transponderKey.deleteMany();

    // Seed all transponder data
    const allTransponderData = [
      ...(bmwTransponderData || []),
      ...(acuraTransponderData || []),
      ...(chevroletTransponderData || []),
      ...(fordTransponderData || []),
      ...(hondaTransponderData || []),
      ...(toyotaTransponderData || []),
      ...(volkswagenTransponderData || []),
      ...(hyundaiTransponderData || []),
      ...(kiaTransponderData || []),
      ...(nissanTransponderData || []),
      ...(audiTransponderData || []),
      ...(suzukiTransponderData || []),
      ...(fiatTransponderData || []),
      ...(isuzuTransponderData || []),
      ...(peugeotTransponderData || []),
      ...(chryslerTransponderData || []),
      ...(lexusTransponderData || []),
      ...(subaruTransponderData || []),
      ...(landRoverTransponderData || []),
      ...(dodgeTransponderData || []),
      ...(transponderUpdates2022 || []),
      ...(buickTransponderData || []),
    ];

    // Log the number of manufacturers
    const uniqueMakes = Array.from(
      new Set(allTransponderData.map((t) => t.make))
    );
    console.log(
      `Found ${uniqueMakes.length} manufacturers: ${uniqueMakes.join(", ")}`
    );

    // Seed new data with progress tracking
    console.log("Seeding transponder data...");
    let successCount = 0;
    let errorCount = 0;

    for (const data of allTransponderData) {
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
            dualSystem: data.dualSystem,
          },
        });
        successCount++;
        console.log(`✓ Created transponder: ${data.make} ${data.model}`);
      } catch (error) {
        errorCount++;
        console.error(
          `✗ Failed to create transponder: ${data.make} ${data.model}`,
          error
        );
      }
    }

    const count = await prisma.transponderKey.count();
    console.log(`\nSeeding completed:`);
    console.log(`- Successfully created: ${successCount} records`);
    console.log(`- Failed to create: ${errorCount} records`);
    console.log(`- Total records in database: ${count}`);
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
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
