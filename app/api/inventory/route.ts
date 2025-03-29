import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inventory = await prisma.transponderInventory.findMany({
      include: {
        transponderKey: true,
      },
      orderBy: {
        transponderKey: {
          transponderType: "asc",
        },
      },
    });

    // Return empty array if no inventory found
    return NextResponse.json(inventory || []);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();

    // If no inventory exists for this transponder key, create it
    const existingInventory = await prisma.transponderInventory.findUnique({
      where: { transponderKeyId: item.id },
    });

    if (!existingInventory) {
      const newInventory = await prisma.transponderInventory.create({
        data: {
          transponderKeyId: item.id,
          quantity: item.quantity || 0,
          minimumStock: 5,
          location: "Main Warehouse",
          supplier: "Default Supplier",
        },
        include: {
          transponderKey: true,
        },
      });
      return NextResponse.json(newInventory);
    }

    // Update existing inventory
    const updatedInventory = await prisma.transponderInventory.update({
      where: { transponderKeyId: item.id },
      data: {
        quantity: item.quantity + 10,
        lastOrdered: new Date(),
      },
      include: {
        transponderKey: true,
      },
    });
    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.error("Error ordering inventory:", error);
    return NextResponse.json(
      { error: "Failed to order inventory" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, quantity } = await request.json();
    const updatedInventory = await prisma.transponderInventory.update({
      where: { id },
      data: { quantity },
      include: {
        transponderKey: true,
      },
    });
    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
