import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalInventory,
      lowStockItems,
      pendingRequests,
      totalTechnicians
    ] = await Promise.all([
      prisma.inventory.count(),
      prisma.inventory.count({
        where: {
          stockCount: {
            lte: 5 // Assuming 5 is the low stock threshold
          }
        }
      }),
      prisma.request.count({
        where: {
          status: 'PENDING'
        }
      }),
      prisma.user.count({
        where: {
          role: 'TECHNICIAN'
        }
      })
    ]);

    return NextResponse.json({
      totalInventory,
      lowStockItems,
      pendingRequests,
      totalTechnicians
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 