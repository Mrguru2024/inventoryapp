import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    await prisma.searchAnalytics.create({
      data: {
        query: data.query,
        category: data.category,
        resultsCount: data.resultsCount,
        filters: JSON.stringify(data.filters || {}),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to store search analytics:', error);
    return NextResponse.json(
      { error: 'Failed to store analytics' },
      { status: 500 }
    );
  }
} 