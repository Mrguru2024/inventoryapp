import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/auth.config';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make')?.toUpperCase();

    if (!make) {
      return NextResponse.json({ error: 'Make is required' }, { status: 400 });
    }

    const models = await prisma.transponderKey.findMany({
      where: {
        make: make
      },
      select: {
        model: true
      },
      distinct: ['model'],
      orderBy: {
        model: 'asc'
      }
    });

    return NextResponse.json(models.map(m => m.model));
  } catch (error) {
    console.error('Models fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
} 