import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { keySchema } from '@/lib/validations/key';
import { authOptions } from '../auth/auth.config';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TECHNICIAN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = keySchema.parse(json);

    const key = await prisma.key.create({
      data: {
        fccId: body.fccId,
        icId: body.icId,
        manufacturer: body.manufacturer,
        manufacturerPartNumber: body.manufacturerPartNumber,
        frequency: body.frequency,
        battery: body.battery,
        buttons: body.buttons,
        emergencyKey: body.emergencyKey,
        testKey: body.testKey,
        replacesPN: body.replacesPN,
        aftermarketFor: body.aftermarketFor,
      },
    });

    return NextResponse.json(key);
  } catch (error) {
    console.error('Failed to create key:', error);
    return NextResponse.json(
      { error: 'Failed to create key' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const keys = await prisma.key.findMany({
      where: {
        OR: [
          {
            fccId: {
              contains: search,
            },
          },
          {
            icId: {
              contains: search,
            },
          },
          {
            manufacturer: {
              contains: search,
            },
          },
          {
            manufacturerPartNumber: {
              contains: search,
            },
          },
          {
            replacesPN: {
              contains: search,
            },
          },
          {
            aftermarketFor: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        manufacturer: 'asc',
      },
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error('Failed to fetch keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keys' },
      { status: 500 }
    );
  }
} 