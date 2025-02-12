import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import path from 'path';
import { z } from 'zod';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

// Schema for validating CSV data
const TransponderSchema = z.object({
  make: z.string().min(1).transform(val => val.toUpperCase()),
  model: z.string().min(1).transform(val => val.toUpperCase()),
  yearStart: z.string().transform(val => parseInt(val) || 0),
  yearEnd: z.string().nullable().transform(val => (val ? parseInt(val) : null)),
  transponderType: z.string(),
  chipType: z.string(),
  frequency: z.string().nullable(),
  notes: z.string().nullable(),
  compatibleParts: z.string().nullable(),
});

type ValidTransponderData = z.infer<typeof TransponderSchema>;

interface ImportResults {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ line: number; error: string }>;
}

async function importCsvFile(filePath: string): Promise<ImportResults> {
  const results: ImportResults = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: [],
  };

  const validRecords: ValidTransponderData[] = [];

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', async (row: Record<string, string>) => {
        results.total++;
        try {
          const validData = TransponderSchema.parse(row);
          validRecords.push(validData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            results.failed++;
            results.errors.push({
              line: results.total,
              error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            });
          }
        }
      })
      .on('end', async () => {
        try {
          // Process valid records in batches
          const batchSize = 100;
          for (let i = 0; i < validRecords.length; i += batchSize) {
            const batch = validRecords.slice(i, i + batchSize);
            await prisma.$transaction(
              batch.map(record =>
                prisma.transponderKey.create({
                  data: record,
                })
              )
            );
            results.successful += batch.length;
          }
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('\nPlease provide the path to the CSV file');
    console.error('Usage: npm run import:transponders -- ./data/your-file.csv');
    console.error('\nTo create a template file, run:');
    console.error('npm run create:transponder-template');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  
  if (!existsSync(filePath)) {
    console.error(`\nError: File not found: ${filePath}`);
    console.error('\nTo create a template file, run:');
    console.error('npm run create:transponder-template');
    console.error('\nThen use the template to create your CSV file and try again.');
    process.exit(1);
  }

  console.log(`Importing transponder data from ${filePath}`);

  try {
    const results = await importCsvFile(filePath);
    
    // Add a summary header
    console.log('\n=== Import Summary ===');
    console.log(`Total records processed: ${results.total}`);
    console.log(`Successfully imported: ${results.successful}`);
    console.log(`Failed to import: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n=== Error Details ===');
      results.errors.forEach(({ line, error }) => {
        console.log(`Line ${line}: ${error}`);
      });
    }

    if (results.successful > 0) {
      console.log('\n✅ Data has been imported successfully!');
    }
  } catch (error) {
    console.error('\n❌ Import failed:', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error); 