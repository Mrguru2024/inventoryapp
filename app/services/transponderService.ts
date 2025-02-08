import { prisma } from '@/lib/prisma';
import { withRetry } from '@/app/utils/retry';
import logger from '@/app/utils/logger';

export interface TransponderKeyData {
  id?: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd?: number;
  transponderType: string;
  chipType: string[] | string;
  compatibleParts?: string[] | string;
  notes?: string;
  vatsEnabled?: boolean;
  vatsSystem?: string;
  dualSystem?: boolean;
}

export const transponderService = {
  async getTransponderByVehicle(make: string, model: string, year: number) {
    const transponder = await prisma.transponderKey.findFirst({
      where: {
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        yearStart: { lte: year },
        OR: [
          { yearEnd: null },
          { yearEnd: { gte: year } }
        ]
      }
    });
    return transponder;
  },

  async addTransponderData(data: TransponderKeyData) {
    return await prisma.transponderKey.create({
      data: {
        ...data,
        make: data.make.toUpperCase(),
        model: data.model.toUpperCase()
      }
    });
  },

  async getCompatibleChips(make: string, model: string, year: number) {
    const transponder = await this.getTransponderByVehicle(make, model, year);
    if (!transponder) return [];

    const chips = [...transponder.chipType];
    if (transponder.dualSystem && transponder.alternateChipType) {
      chips.push(...transponder.alternateChipType);
    }
    return chips;
  }
};

export async function getTransponders(): Promise<TransponderKeyData[]> {
  return withRetry(
    async () => {
      try {
        const response = await fetch('/api/transponders');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}, details: ${errorData.details || 'No details available'}`
          );
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format from server');
        }
        
        return data.map((t: any) => ({
          id: t.id || '',
          make: t.make || '',
          model: t.model || '',
          yearStart: t.yearStart || 0,
          yearEnd: t.yearEnd || undefined,
          chipType: Array.isArray(t.chipType) ? t.chipType : [],
          frequency: t.frequency || undefined,
          transponderType: t.transponderType || '',
          compatibleParts: Array.isArray(t.compatibleParts) ? t.compatibleParts : [],
          notes: t.notes || undefined,
          dualSystem: !!t.dualSystem,
          alternateChipType: Array.isArray(t.alternateChipType) ? t.alternateChipType : []
        }));
      } catch (error) {
        console.error('Error in getTransponders:', error);
        throw error;
      }
    },
    { maxAttempts: 3, delay: 2000, backoff: true }
  );
}

export async function getTransponderData(): Promise<TransponderKeyData[]> {
  try {
    const transponders = await prisma.transponderKey.findMany({
      orderBy: { make: 'asc' },
    });

    return transponders.map(transponder => ({
      ...transponder,
      chipType: JSON.parse(transponder.chipType),
      compatibleParts: transponder.compatibleParts 
        ? JSON.parse(transponder.compatibleParts)
        : undefined,
    }));
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch transponder data from database');
  }
}

export async function searchTransponders(query: string): Promise<TransponderKeyData[]> {
  try {
    const transponders = await prisma.transponderKey.findMany({
      where: {
        OR: [
          { make: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
          { transponderType: { contains: query, mode: 'insensitive' } },
          { chipType: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return transponders.map(transponder => ({
      ...transponder,
      chipType: JSON.parse(transponder.chipType),
      compatibleParts: transponder.compatibleParts 
        ? JSON.parse(transponder.compatibleParts)
        : undefined,
    }));
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search transponder data');
  }
}

// Helper function to safely parse JSON
function tryParseJSON<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', jsonString, error);
    return defaultValue;
  }
} 