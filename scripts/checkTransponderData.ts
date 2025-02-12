import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface TransponderSummary {
  makes: {
    name: string;
    modelCount: number;
    models: {
      name: string;
      yearRange: string;
      transponderTypes: string[];
    }[];
  }[];
  totalRecords: number;
  uniqueMakes: number;
  uniqueModels: number;
}

async function getTransponderSummary(): Promise<TransponderSummary> {
  try {
    // Get all transponder records
    const records = await prisma.transponderKey.findMany({
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
        { yearStart: 'asc' }
      ]
    });

    const makeMap = new Map<string, Set<string>>();
    const summary: TransponderSummary = {
      makes: [],
      totalRecords: records.length,
      uniqueMakes: 0,
      uniqueModels: 0
    };

    // Group by make
    records.forEach(record => {
      if (!makeMap.has(record.make)) {
        makeMap.set(record.make, new Set());
      }
      makeMap.get(record.make)?.add(record.model);
    });

    // Process each make
    for (const [makeName, models] of makeMap) {
      const makeRecords = records.filter(r => r.make === makeName);
      const modelSummaries = Array.from(models).map(modelName => {
        const modelRecords = makeRecords.filter(r => r.model === modelName);
        const yearRange = `${Math.min(...modelRecords.map(r => r.yearStart))} - ${
          Math.max(...modelRecords.map(r => r.yearEnd || new Date().getFullYear()))
        }`;
        const transponderTypes = Array.from(new Set(modelRecords.map(r => r.transponderType)));

        return {
          name: modelName,
          yearRange,
          transponderTypes
        };
      });

      summary.makes.push({
        name: makeName,
        modelCount: models.size,
        models: modelSummaries
      });
    }

    summary.uniqueMakes = makeMap.size;
    summary.uniqueModels = Array.from(makeMap.values()).reduce((acc, models) => acc + models.size, 0);

    return summary;
  } catch (error) {
    console.error('Error getting transponder summary:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Analyzing transponder database...\n');
    
    const summary = await getTransponderSummary();
    
    // Print summary
    console.log('=== Database Summary ===');
    console.log(`Total Records: ${summary.totalRecords}`);
    console.log(`Unique Makes: ${summary.uniqueMakes}`);
    console.log(`Unique Models: ${summary.uniqueModels}\n`);
    
    // Print details for each make
    console.log('=== Make Details ===');
    summary.makes.forEach(make => {
      console.log(`\n${make.name} (${make.modelCount} models):`);
      make.models.forEach(model => {
        console.log(`  - ${model.name}`);
        console.log(`    Years: ${model.yearRange}`);
        console.log(`    Transponders: ${model.transponderTypes.join(', ')}`);
      });
    });

    // Save detailed report to file
    const reportPath = path.join(process.cwd(), 'data', 'transponder-report.json');
    writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 