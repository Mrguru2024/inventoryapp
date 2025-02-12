import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface TransponderData {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  frequency: string | null;
  notes: string | null;
  compatibleParts: string | null;
}

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function fetchWithRetry(url: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Attempt ${i + 1} failed:`, errorMessage);
      if (i === retries - 1) throw error;
      await delay(2000 * (i + 1));
    }
  }
  throw new Error('All retries failed');
}

async function scrapeMake(make: string): Promise<TransponderData[]> {
  try {
    const url = `https://www.transpondery.com/transponder_catalog/${make.toLowerCase()}.html`;
    console.log(`Fetching ${url}`);
    
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    
    const data: TransponderData[] = [];
    
    // Find the table with transponder data
    $('table').each((_, table) => {
      const $table = $(table);
      if ($table.text().includes('Model') || $table.text().includes('Transponder')) {
        $table.find('tr').slice(1).each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 6) {
            const yearRange = $(cells[1]).text().trim();
            const yearMatch = yearRange.match(/(\d{4})\s*-?\s*(\d{4}|\+)?/);
            
            data.push({
              make: make.toUpperCase(),
              model: $(cells[0]).text().trim().toUpperCase(),
              yearStart: yearMatch ? parseInt(yearMatch[1]) : 0,
              yearEnd: yearMatch && yearMatch[2] && yearMatch[2] !== '+' ? parseInt(yearMatch[2]) : null,
              transponderType: $(cells[2]).text().trim(),
              chipType: $(cells[3]).text().trim(),
              frequency: $(cells[4]).text().trim() || null,
              notes: $(cells[5]).text().trim() || null,
              compatibleParts: cells[6] ? $(cells[6]).text().trim() || null : null,
            });
          }
        });
      }
    });

    console.log(`Found ${data.length} models for ${make}`);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error scraping ${make}:`, errorMessage);
    return [];
  }
}

async function scrapeAllMakes() {
  console.log('Starting transponder scraping...');
  
  try {
    // Get list of makes from main page
    const mainPageHtml = await fetchWithRetry('https://www.transpondery.com/transponder_catalog.html');
    const $ = cheerio.load(mainPageHtml);
    
    const makes = $('a[href*="transponder_catalog"]')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    console.log(`Found ${makes.length} makes to scrape`);
    const allData: TransponderData[] = [];

    for (const make of makes) {
      console.log(`\nScraping ${make}...`);
      const makeData = await scrapeMake(make);
      
      if (makeData.length > 0) {
        allData.push(...makeData);

        // Save to database in batches
        try {
          await prisma.$transaction(
            makeData.map(item => 
              prisma.transponderKey.create({
                data: item
              })
            )
          );
          console.log(`Saved ${makeData.length} models for ${make}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error(`Error saving ${make} to database:`, errorMessage);
        }

        // Save backup
        const backupPath = path.join(process.cwd(), 'data', 'transponder-data.json');
        writeFileSync(backupPath, JSON.stringify(allData, null, 2));
      }

      // Add delay between makes
      await delay(3000);
    }

    console.log('\nScraping completed successfully!');
    console.log(`Total records: ${allData.length}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Fatal scraping error:', errorMessage);
  } finally {
    await prisma.$disconnect();
  }
}

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir);
}

// Run the scraper
scrapeAllMakes().catch(console.error); 