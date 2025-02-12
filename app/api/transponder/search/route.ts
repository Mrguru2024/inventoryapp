import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make')?.toUpperCase() || '';
    const model = searchParams.get('model')?.toUpperCase() || '';
    const year = searchParams.get('year');
    const chipType = searchParams.get('chipType');

    let whereClause: any = {};

    if (make || model || year || chipType) {
      whereClause = {
        AND: []
      };

      if (make) {
        whereClause.AND.push({
          make: make
        });
      }

      if (model) {
        whereClause.AND.push({
          model: model
        });
      }

      if (year) {
        const yearNum = parseInt(year);
        whereClause.AND.push({
          yearStart: { lte: yearNum },
          yearEnd: { gte: yearNum }
        });
      }

      if (chipType) {
        whereClause.AND.push({
          chipType: {
            contains: chipType
          }
        });
      }
    }

    const transponders = await prisma.transponderKey.findMany({
      where: whereClause,
      orderBy: [
        { make: 'asc' },
        { model: 'asc' },
        { yearStart: 'desc' }
      ]
    });

    return NextResponse.json(transponders);
  } catch (error) {
    console.error('Transponder search error:', error);
    return NextResponse.json({ error: 'Failed to search transponders' }, { status: 500 });
  }
} 