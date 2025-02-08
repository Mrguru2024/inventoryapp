import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const counts = await prisma.transponderKey.groupBy({
      by: ['make'],
      _count: {
        _all: true
      }
    });

    const invalidRecords = await prisma.transponderKey.findMany({
      where: {
        OR: [
          { chipType: { equals: '[]' } },
          { chipType: { equals: 'null' } },
          { make: { equals: '' } },
          { model: { equals: '' } }
        ]
      }
    });

    return NextResponse.json({
      totalRecords: await prisma.transponderKey.count(),
      recordsByMake: counts,
      invalidRecords: invalidRecords.length > 0 ? invalidRecords : 'No invalid records found',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify transponder data' },
      { status: 500 }
    );
  }
} 