import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Test the database connection first
    await prisma.$connect();
    
    // Add logging
    console.log('Fetching transponders from database...');
    
    const transponders = await prisma.transponderKey.findMany({
      select: {
        id: true,
        make: true,
        model: true,
        yearStart: true,
        yearEnd: true,
        chipType: true,
        frequency: true,
        transponderType: true,
        compatibleParts: true,
        notes: true,
        dualSystem: true,
        alternateChipType: true
      }
    });

    // Parse JSON strings back to arrays
    const formattedTransponders = transponders.map(t => ({
      ...t,
      chipType: tryParseJSON(t.chipType, []),
      compatibleParts: tryParseJSON(t.compatibleParts, []),
      alternateChipType: tryParseJSON(t.alternateChipType, [])
    }));

    console.log(`Found ${formattedTransponders.length} transponders`);
    
    return NextResponse.json(formattedTransponders, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Prisma error:', error);
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 503 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database query failed', code: error.code, details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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