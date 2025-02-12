import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    try {
      const keys = await prisma.key.findMany({
        where: {
          OR: [
            { fccId: { contains: search } },
            { manufacturer: { contains: search } }
          ]
        },
        select: {
          id: true,
          fccId: true,
          manufacturer: true,
          frequency: true,
          battery: true,
          buttons: true,
          emergencyKey: true,
          testKey: true,
          partNumber: true,
          year: true,
          make: true,
          model: true,
          icNumber: true,
          continentalNumber: true,
          status: true,
          _count: {
            select: {
              checkouts: true
            }
          }
        }
      });

      console.log('Found keys:', keys.length);

      // Transform the data to match the frontend interface
      const transformedKeys = keys.map(key => ({
        id: key.id,
        fccId: key.fccId,
        manufacturer: key.manufacturer,
        keyType: key.make || key.manufacturer,
        replacesPN: key.partNumber || key.fccId,
        quantity: key.status === 'AVAILABLE' ? 1 : 0, // Simple quantity based on status
        price: 29.99, // Default price
        frequency: key.frequency,
        battery: key.battery,
        buttons: key.buttons,
        emergencyKey: key.emergencyKey,
        isOnSale: false,
        saleType: 'SALE',
        make: key.make,
        model: key.model,
        year: key.year,
        icNumber: key.icNumber,
        continentalNumber: key.continentalNumber,
        checkoutCount: key._count.checkouts
      }));

      return NextResponse.json(transformedKeys);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('POST Session:', session);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Order data:', data);

    try {
      const order = await prisma.order.create({
        data: {
          userId: parseInt(session.user.id),
          total: data.total,
          status: 'PENDING',
          items: {
            create: data.items.map((item: any) => ({
              keyId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Update quantities in a transaction
      await prisma.$transaction(
        data.items.map((item: any) =>
          prisma.key.update({
            where: { id: item.id },
            data: {
              quantity: {
                decrement: item.quantity
              }
            }
          })
        )
      );

      return NextResponse.json(order);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 