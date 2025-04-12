import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { quantity, costPerUnit } = body;

    const inventory = await prisma.technicianInventory.update({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure the item belongs to the user
      },
      data: {
        quantity,
        costPerUnit,
        totalValue: quantity * costPerUnit,
      },
      include: {
        item: true,
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.technicianInventory.delete({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure the item belongs to the user
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
