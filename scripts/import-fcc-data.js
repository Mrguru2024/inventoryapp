const fs = require("fs");
const path = require("path");
const csv = require("csv-parse");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importFccData() {
  const csvFilePath = path.join(__dirname, "../data/fcc-id-data.csv");

  if (!fs.existsSync(csvFilePath)) {
    console.error(
      "❌ CSV file not found. Please add the data to data/fcc-id-data.csv"
    );
    return;
  }

  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  const records = await new Promise((resolve, reject) => {
    csv.parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      (err, records) => {
        if (err) reject(err);
        else resolve(records);
      }
    );
  });

  console.log(`Found ${records.length} records to import`);

  let updated = 0;
  let created = 0;
  let errors = 0;

  for (const record of records) {
    try {
      // Skip example rows
      if (record.Make.startsWith("Example:")) continue;

      // Clean up the data
      const fccId = record.FCC_ID?.toUpperCase().trim();
      if (!fccId) {
        console.error(
          `Skipping record with no FCC ID: ${JSON.stringify(record)}`
        );
        errors++;
        continue;
      }

      // Create or update the FCC ID record
      const description = `${record.Make} ${record.Model} ${record.Year} - ${record.Transponder_Type}`;
      await prisma.FCCId.upsert({
        where: { id: fccId },
        update: { description },
        create: {
          id: fccId,
          description,
          status: "active",
        },
      });

      // Create or update the transponder key record
      const transponderKey = await prisma.transponderKey.upsert({
        where: {
          make_model_yearStart: {
            make: record.Make.toUpperCase(),
            model: record.Model.toUpperCase(),
            yearStart: parseInt(record.Year),
          },
        },
        update: {
          fccId,
          transponderType: record.Transponder_Type,
          chipType: record.Chip_Type,
          compatibleParts: record.Compatible_Parts,
          frequency: record.Frequency,
          notes: record.Notes,
        },
        create: {
          make: record.Make.toUpperCase(),
          model: record.Model.toUpperCase(),
          yearStart: parseInt(record.Year),
          yearEnd: parseInt(record.Year),
          fccId,
          transponderType: record.Transponder_Type,
          chipType: record.Chip_Type,
          compatibleParts: record.Compatible_Parts,
          frequency: record.Frequency,
          notes: record.Notes,
        },
      });

      if (transponderKey) updated++;
      else created++;
    } catch (error) {
      console.error(`Error processing record:`, record, error);
      errors++;
    }
  }

  console.log("\nImport complete:");
  console.log(`- Created: ${created}`);
  console.log(`- Updated: ${updated}`);
  console.log(`- Errors: ${errors}`);
}

importFccData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
