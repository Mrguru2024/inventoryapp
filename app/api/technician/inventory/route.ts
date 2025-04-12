import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const inventory = await prisma.technicianInventory.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        item: true,
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { sku, brand, model, quantity, costPerUnit } = body;

    // First, find or create the base item
    const item = await prisma.inventoryItem.upsert({
      where: {
        sku,
      },
      update: {},
      create: {
        sku,
        brand,
        model,
      },
    });

    // Then create the technician's inventory entry
    const technicianInventory = await prisma.technicianInventory.create({
      data: {
        userId: session.user.id,
        itemId: item.id,
        quantity,
        costPerUnit,
        totalValue: quantity * costPerUnit,
      },
      include: {
        item: true,
      },
    });

    return NextResponse.json(technicianInventory);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
