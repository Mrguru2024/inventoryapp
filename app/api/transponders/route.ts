import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const transponders = await prisma.transponderKey.findMany({
      orderBy: { make: 'asc' }
    });
    return NextResponse.json(transponders);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transponder data' },
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