import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: { barcode: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const key = await prisma.key.findFirst({
      where: {
        OR: [
          { partNumber: params.barcode },
          { fccId: params.barcode },
          { continentalNumber: params.barcode },
        ],
      },
    });

    if (!key) {
      return new NextResponse('Key not found', { status: 404 });
    }

    return NextResponse.json(key);
  } catch (error) {
    console.error('Error searching key:', error);
    return new NextResponse('Error searching key', { status: 500 });
  }
} 