import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { ScrapedTransponderData } from '../types/transponder';

export async function scrapeHondaData(): Promise<ScrapedTransponderData[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.honda-tech.com/transponder-database', { 
      waitUntil: 'networkidle0' 
    });
    
    const content = await page.content();
    const $ = cheerio.load(content);
    const data: ScrapedTransponderData[] = [];

    $('.transponder-table tr').each((_, row) => {
      const cols = $(row).find('td');
      if (cols.length > 0) {
        const yearRange = $(cols[1]).text().trim().split('-');
        data.push({
          make: 'Honda',
          model: $(cols[0]).text().trim(),
          yearStart: parseInt(yearRange[0]),
          yearEnd: yearRange[1] ? parseInt(yearRange[1]) : null,
          transponderType: $(cols[2]).text().trim(),
          chipType: [$(cols[3]).text().trim()],
          compatibleParts: $(cols[4]).text().trim().split(',').map(p => p.trim()),
          frequency: '433 MHz',
          notes: $(cols[5]).text().trim(),
          dualSystem: false
        });
      }
    });

    return data;
  } finally {
    await browser.close();
  }
} 