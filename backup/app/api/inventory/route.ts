import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const inventory = await prisma.inventory.create({
      data: {
        sku: data.sku,
        brand: data.brand,
        model: data.model,
        stockCount: data.stockCount,
        lowStockThreshold: data.lowStockThreshold,
      },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
} 