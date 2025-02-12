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

    // Get total keys
    const totalKeys = await prisma.key.count();

    // Get low stock keys (assuming we add a quantity field to the Key model)
    const lowStock = await prisma.transponderKey.count({
      where: {
        // Add your low stock condition here
        // For example: quantity < threshold
      }
    });

    // Get active users
    const activeUsers = await prisma.user.count();

    // Since we don't have orders in the current schema, we'll return 0
    const pendingOrders = 0;

    return NextResponse.json({
      totalKeys,
      lowStock,
      pendingOrders,
      activeUsers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 