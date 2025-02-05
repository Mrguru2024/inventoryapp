import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'TECHNICIAN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recentRequests = await prisma.request.findMany({
      where: { technicianId: user.id },
      include: {
        item: {
          select: {
            brand: true,
            model: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json(recentRequests);
  } catch (error) {
    console.error('Recent requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent requests' },
      { status: 500 }
    );
  }
} 