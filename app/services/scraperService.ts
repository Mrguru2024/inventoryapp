import { PrismaClient } from "@prisma/client";
import { scrapeBMWData } from "./scrapers/bmwScraper";
import { scrapeHondaData } from "./scrapers/hondaScraper";
import { TransponderImportResult } from "./types/transponder";
import * as cheerio from "cheerio";
import { prisma } from "@/lib/prisma";

const prismaClient = new PrismaClient();

export async function importAllTransponderData(): Promise<
  TransponderImportResult[]
> {
  const results: TransponderImportResult[] = [];

  try {
    // Import BMW data
    try {
      const bmwData = await scrapeBMWData();
      for (const data of bmwData) {
        await prismaClient.transponderKey.create({
          data: {
            make: data.make,
            model: data.model,
            yearStart: data.yearStart,
            yearEnd: data.yearEnd,
            transponderType: data.transponderType,
            chipType: JSON.stringify(data.chipType),
            compatibleParts: JSON.stringify(data.compatibleParts),
            frequency: data.frequency,
            notes: data.notes,
            dualSystem: data.dualSystem,
          },
        });
      }
      results.push({ make: "BMW", count: bmwData.length, success: true });
    } catch (error) {
      results.push({
        make: "BMW",
        count: 0,
        success: false,
        error: error.message,
      });
    }

    // Import Honda data
    try {
      const hondaData = await scrapeHondaData();
      for (const data of hondaData) {
        await prismaClient.transponderKey.create({
          data: {
            make: data.make,
            model: data.model,
            yearStart: data.yearStart,
            yearEnd: data.yearEnd,
            transponderType: data.transponderType,
            chipType: JSON.stringify(data.chipType),
            compatibleParts: JSON.stringify(data.compatibleParts),
            frequency: data.frequency,
            notes: data.notes,
            dualSystem: data.dualSystem,
          },
        });
      }
      results.push({ make: "Honda", count: hondaData.length, success: true });
    } catch (error) {
      results.push({
        make: "Honda",
        count: 0,
        success: false,
        error: error.message,
      });
    }

    return results;
  } catch (error) {
    console.error("Error importing transponder data:", error);
    throw error;
  }
}

export async function scrapeTransponderData(make: string, url: string) {
  // This will be implemented later for web scraping
  // Will use Puppeteer/Cheerio to scrape other manufacturer data
  throw new Error("Not implemented yet");
}

export async function importBMWTransponderData(html: string) {
  const $ = cheerio.load(html);
  const transponders = [];

  $("table tr").each((_, element) => {
    const columns = $(element).find("td");
    if (columns.length >= 4) {
      transponders.push({
        partNumber: $(columns[0]).text().trim(),
        fccId: $(columns[1]).text().trim(),
        frequency: $(columns[2]).text().trim(),
        description: $(columns[3]).text().trim(),
      });
    }
  });

  for (const transponder of transponders) {
    await prisma.transponderKey.upsert({
      where: {
        partNumber: transponder.partNumber,
      },
      update: transponder,
      create: transponder,
    });
  }

  return transponders;
}
