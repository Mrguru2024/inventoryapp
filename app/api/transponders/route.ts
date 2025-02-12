import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/app/utils/logger';
import { type NextRequest } from 'next/server';

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    // Verify database connection
    if (!prisma) {
      throw new Error('Database client not initialized');
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const chipType = searchParams.get('chipType');
    const transponderType = searchParams.get('transponderType');

    // Build where clause based on filters
    const where = {
      ...(make && { make: { contains: make, mode: 'insensitive' as const } }),
      ...(model && { model: { contains: model, mode: 'insensitive' as const } }),
      ...(transponderType && { transponderType: { contains: transponderType, mode: 'insensitive' as const } }),
      // For chipType, we need to search within the JSON array
      ...(chipType && { 
        chipType: {
          contains: chipType,
          mode: 'insensitive' as const
        }
      })
    };

    const result = await prisma.$transaction(async (tx) => {
      // Get filtered count
      const count = await tx.transponder.count({ where });
      logger.info(`Total filtered transponder count: ${count}`);

      // Get filtered transponders
      const transponders = await tx.transponder.findMany({
        where,
        select: {
          id: true,
          make: true,
          model: true,
          yearStart: true,
          yearEnd: true,
          transponderType: true,
          chipType: true,
          frequency: true,
          compatibleParts: true,
          notes: true
        },
        orderBy: [
          { make: 'asc' },
          { model: 'asc' },
          { yearStart: 'desc' }
        ]
      });

      // Get unique values for filters
      const [makes, models, chipTypes, transponderTypes] = await Promise.all([
        tx.transponder.findMany({
          select: { make: true },
          distinct: ['make'],
          orderBy: { make: 'asc' }
        }),
        tx.transponder.findMany({
          select: { model: true },
          distinct: ['model'],
          orderBy: { model: 'asc' }
        }),
        tx.transponder.findMany({
          select: { chipType: true },
          distinct: ['chipType']
        }),
        tx.transponder.findMany({
          select: { transponderType: true },
          distinct: ['transponderType'],
          orderBy: { transponderType: 'asc' }
        })
      ]);

      return {
        transponders,
        filters: {
          makes: makes.map(m => m.make),
          models: models.map(m => m.model),
          chipTypes: [...new Set(chipTypes.flatMap(c => 
            typeof c.chipType === 'string' ? JSON.parse(c.chipType) : c.chipType
          ))].sort(),
          transponderTypes: transponderTypes.map(t => t.transponderType)
        },
        count
      };
    });

    // Format the transponder data
    const formattedTransponders = result.transponders.map(t => {
      try {
        return {
          ...t,
          chipType: typeof t.chipType === 'string' ? JSON.parse(t.chipType) : t.chipType,
          compatibleParts: typeof t.compatibleParts === 'string' ? 
            JSON.parse(t.compatibleParts) : t.compatibleParts
        };
      } catch (parseError) {
        logger.error('Error parsing transponder data:', parseError, t);
        return t;
      }
    });

    return NextResponse.json({
      transponders: formattedTransponders,
      filters: result.filters,
      count: result.count
    });
  } catch (error) {
    // More detailed error logging
    logger.error('API error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return NextResponse.json(
      { error: 'Failed to fetch transponders', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to safely parse JSON
function tryParseJSON<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
} 