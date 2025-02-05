import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { status } = data;

    // Get the request with its related inventory item
    const existingRequest = await prisma.request.findUnique({
      where: { id: parseInt(params.id) },
      include: { item: true }
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // If approving, check if there's enough stock
    if (status === 'APPROVED') {
      if (existingRequest.item.stockCount < existingRequest.quantityRequested) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }

      // Update inventory stock
      await prisma.inventory.update({
        where: { id: existingRequest.item.id },
        data: {
          stockCount: {
            decrement: existingRequest.quantityRequested
          }
        }
      });
    }

    // Update request status
    const updatedRequest = await prisma.request.update({
      where: { id: parseInt(params.id) },
      data: { status },
      include: {
        technician: true,
        item: true
      }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Request update error:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
} 