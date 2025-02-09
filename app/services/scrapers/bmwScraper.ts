import { ScrapedTransponderData } from '../types/transponder';
import { bmwTransponderData } from '@/app/data/bmwTransponders';

export async function scrapeBMWData(): Promise<ScrapedTransponderData[]> {
  const data: ScrapedTransponderData[] = [];
  
  for (const series of bmwTransponderData) {
    for (const model of series.models) {
      data.push({
        make: 'BMW',
        model,
        yearStart: series.years.start,
        yearEnd: series.years.end || null,
        transponderType: series.transponder.type,
        chipType: series.transponder.chips,
        compatibleParts: series.oem.keys,
        frequency: '433 MHz',
        notes: `${series.transponder.system}${series.isMotorcycle ? ' - Motorcycle' : ''}`,
        dualSystem: false,
      });
    }
  }
  
  return data;
} 