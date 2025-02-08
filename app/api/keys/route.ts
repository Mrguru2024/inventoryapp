import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { keySchema } from '@/lib/validations/key';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TECHNICIAN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = keySchema.parse(json);

    const key = await prisma.key.create({
      data: body,
    });

    return NextResponse.json(key);
  } catch (error) {
    console.error('Error creating key:', error);
    return new NextResponse('Error creating key', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    const where = {
      ...(make && { make }),
      ...(model && { model }),
      ...(year && { year }),
    };

    const keys = await prisma.key.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error fetching keys:', error);
    return new NextResponse('Error fetching keys', { status: 500 });
  }
} 