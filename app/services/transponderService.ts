import { prisma } from '@/lib/prisma';
import logger from '@/app/utils/logger';
import axios from 'axios';

export interface TransponderData {
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd?: number | null;
  transponderType: string;
  chipType: string[];
  frequency: string;
  compatibleParts: string[];
  notes?: string | null;
}

export interface TransponderResponse {
  transponders: TransponderData[];
  filters: {
    makes: string[];
    models: string[];
    chipTypes: string[];
    transponderTypes: string[];
  };
  count: number;
}

export const transponderService = {
  async getTransponderByVehicle(make: string, model: string, year: number) {
    const transponder = await prisma.transponder.findFirst({
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

  async getCompatibleChips(make: string, model: string, year: number) {
    const transponder = await this.getTransponderByVehicle(make, model, year);
    if (!transponder) return [];

    return typeof transponder.chipType === 'string' ? 
      JSON.parse(transponder.chipType) : 
      transponder.chipType;
  }
};

export const getTransponders = async (
  filters?: {
    make?: string;
    model?: string;
    chipType?: string;
    transponderType?: string;
  }
): Promise<TransponderResponse> => {
  try {
    // Build query params
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await axios.get<TransponderResponse>('/api/transponders', {
      params
    });

    logger.info(`Fetched ${response.data.transponders?.length} transponders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error) {
        throw new Error(`API Error: ${error.response.data.error}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
    
    logger.error('Transponder fetch error:', error);
    throw new Error('Failed to fetch transponder data');
  }
};

export const searchTransponders = async (searchTerm: string = ''): Promise<TransponderData[]> => {
  try {
    const response = await axios.get<TransponderResponse>('/api/transponders', {
      params: { search: searchTerm }
    });
    
    return response.data.transponders;
  } catch (error) {
    logger.error('Error searching transponders:', error);
    return [];
  }
};

export async function getTransponderByVehicle(make: string, model: string, year: number) {
  try {
    const response = await axios.get(`/api/transponders/vehicle?make=${make}&model=${model}&year=${year}`);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Failed to fetch vehicle transponder data');
  }
}

export async function getTransponderData(): Promise<TransponderData[]> {
  try {
    const response = await axios.get('/api/transponders');
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Failed to fetch transponder data');
  }
}

export async function getTranspondersByVehicle(
  make: string,
  model: string,
  year: string
): Promise<TransponderData[]> {
  const yearNum = parseInt(year);
  
  try {
    const transponders = await prisma.transponder.findMany({
      where: {
        AND: [
          { make: make.toUpperCase() },
          { model: model.toUpperCase() },
          {
            yearStart: {
              lte: yearNum
            }
          },
          {
            yearEnd: {
              gte: yearNum
            }
          }
        ]
      }
    });

    return transponders.map(t => ({
      id: t.id,
      make: t.make,
      model: t.model,
      yearStart: t.yearStart,
      yearEnd: t.yearEnd,
      transponderType: t.transponderType,
      chipType: t.chipType,
      frequency: t.frequency || '',
      compatibleParts: t.compatibleParts || '',
      notes: t.notes || undefined
    }));
  } catch (error) {
    console.error('Error fetching transponders:', error);
    throw new Error('Failed to fetch transponder data');
  }
}

export async function getAllTransponders(): Promise<TransponderData[]> {
  try {
    const transponders = await prisma.transponder.findMany({
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
        { yearStart: 'desc' }
      ]
    });

    return transponders.map(t => ({
      id: t.id,
      make: t.make,
      model: t.model,
      yearStart: t.yearStart,
      yearEnd: t.yearEnd,
      transponderType: t.transponderType,
      chipType: t.chipType,
      frequency: t.frequency || '',
      compatibleParts: t.compatibleParts || '',
      notes: t.notes || undefined
    }));
  } catch (error) {
    console.error('Error fetching all transponders:', error);
    throw new Error('Failed to fetch transponder data');
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