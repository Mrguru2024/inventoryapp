import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { inventoryId, quantityRequested } = data;

    // Get the user's ID from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const request = await prisma.request.create({
      data: {
        technicianId: user.id,
        inventoryId,
        quantityRequested,
        status: 'PENDING'
      },
      include: {
        technician: true,
        item: true
      }
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error('Request creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const requests = await prisma.request.findMany({
      where: session.user.role === 'ADMIN' 
        ? {} 
        : { technicianId: user.id },
      include: {
        technician: true,
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Request fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
} 