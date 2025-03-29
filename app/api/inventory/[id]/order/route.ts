import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await request.json();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    // Update the inventory item with order information
    const updatedInventory = await prisma.transponderInventory.update({
      where: { id },
      data: {
        lastOrdered: new Date(),
        quantity: item.quantity,
        notes: item.notes || undefined,
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
