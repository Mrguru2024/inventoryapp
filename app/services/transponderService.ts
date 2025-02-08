import { prisma } from '@/lib/prisma';
import { withRetry } from '@/app/utils/retry';
import logger from '@/app/utils/logger';
import axios from 'axios';

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

export interface TransponderData {
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  frequency: string | null;
  remoteFrequency?: string | null;
  notes: string | null;
  dualSystem: boolean;
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

export async function getTransponders() {
  try {
    const response = await axios.get('/api/transponders');
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Failed to fetch transponder data');
  }
}

export async function getTransponderByVehicle(make: string, model: string, year: number) {
  try {
    const response = await axios.get(`/api/transponders/vehicle?make=${make}&model=${model}&year=${year}`);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Failed to fetch vehicle transponder data');
  }
}

export async function getTransponderData(): Promise<TransponderKeyData[]> {
  try {
    const response = await axios.get('/api/transponders');
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Failed to fetch transponder data');
  }
}

export async function searchTransponders(query: string): Promise<TransponderData[]> {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await axios.get(`/api/transponders/search?q=${encodeURIComponent(query)}`);
    return response.data;
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