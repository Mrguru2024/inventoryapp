import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [makes, years, chipTypes] = await Promise.all([
      prisma.transponderKey.findMany({
        select: { make: true },
        distinct: ['make'],
        orderBy: { make: 'asc' }
      }),
      prisma.transponderKey.findMany({
        select: { yearStart: true },
        distinct: ['yearStart'],
        orderBy: { yearStart: 'desc' }
      }),
      prisma.transponderKey.findMany({
        select: { chipType: true },
        distinct: ['chipType'],
        orderBy: { chipType: 'asc' }
      })
    ]);

    return NextResponse.json({
      makes: makes.map(m => m.make),
      years: years.map(y => y.yearStart),
      chipTypes: chipTypes.map(c => c.chipType)
    });
  } catch (error) {
    console.error('Filter options error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 