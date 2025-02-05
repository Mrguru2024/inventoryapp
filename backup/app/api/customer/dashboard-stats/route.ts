import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [totalPurchases, pendingDeliveries, totalSpentResult] = await Promise.all([
      prisma.order.count({
        where: { customerId: user.id }
      }),
      prisma.order.count({
        where: {
          customerId: user.id,
          status: 'PENDING'
        }
      }),
      prisma.order.aggregate({
        where: { customerId: user.id },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    return NextResponse.json({
      totalPurchases,
      pendingDeliveries,
      totalSpent: totalSpentResult._sum.totalAmount || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 