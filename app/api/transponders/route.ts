import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toUpperCase() || '';
    const make = searchParams.get('make')?.toUpperCase() || '';
    const model = searchParams.get('model')?.toUpperCase() || '';
    const transponderType = searchParams.get('type') || '';

    const where: any = {};
    const conditions = [];

    // Add search condition if search term exists
    if (search) {
      conditions.push(
        { make: { contains: search } },
        { model: { contains: search } },
        { transponderType: { contains: search } }
      );
      where.OR = conditions;
    }

    // Add exact match filters
    if (make) where.make = make;
    if (model) where.model = model;
    if (transponderType) where.transponderType = transponderType;

    const transponders = await prisma.transponderKey.findMany({
      where,
      orderBy: [
        { make: 'asc' },
        { model: 'asc' }
      ]
    });

    // Transform the data
    const transformedData = transponders.map(t => ({
      id: t.id,
      make: t.make,
      model: t.model,
      yearStart: t.yearStart,
      yearEnd: t.yearEnd,
      transponderType: t.transponderType,
      chipType: Array.isArray(t.chipType) ? t.chipType : JSON.parse(t.chipType || '[]'),
      compatibleParts: t.compatibleParts ? 
        (Array.isArray(t.compatibleParts) ? t.compatibleParts : JSON.parse(t.compatibleParts)) 
        : null,
      frequency: t.frequency,
      notes: t.notes,
      dualSystem: t.dualSystem
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error in transponders route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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