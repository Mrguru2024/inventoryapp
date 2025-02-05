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

    const [totalRequests, pendingRequests, approvedRequests, rejectedRequests] = 
      await Promise.all([
        prisma.request.count({
          where: { technicianId: user.id }
        }),
        prisma.request.count({
          where: { 
            technicianId: user.id,
            status: 'PENDING'
          }
        }),
        prisma.request.count({
          where: {
            technicianId: user.id,
            status: 'APPROVED'
          }
        }),
        prisma.request.count({
          where: {
            technicianId: user.id,
            status: 'REJECTED'
          }
        })
      ]);

    return NextResponse.json({
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 