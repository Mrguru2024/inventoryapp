import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  try {
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    console.log('Searching for:', query); // Debug log

    const transponders = await prisma.transponderKey.findMany({
      where: {
        OR: [
          { make: { contains: query } },
          { model: { contains: query } },
          { transponderType: { contains: query } },
          { chipType: { contains: query } }
        ]
      },
      orderBy: { make: 'asc' }
    });

    console.log('Found transponders:', transponders.length); // Debug log

    // Transform the data before sending
    const formattedTransponders = transponders.map(transponder => ({
      ...transponder,
      chipType: tryParseJSON(transponder.chipType, []),
      compatibleParts: tryParseJSON(transponder.compatibleParts, [])
    }));

    return NextResponse.json(formattedTransponders);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search transponder data' },
      { status: 500 }
    );
  }
}

// Helper function to safely parse JSON
function tryParseJSON<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
} 