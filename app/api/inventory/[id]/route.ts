import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/lib/auth/types";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    const updatedInventory = await prisma.transponderInventory.update({
      where: { id },
      data: { quantity },
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await request.json();
    const {
      sku,
      brand,
      model,
      stockCount,
      lowStockThreshold,
      price,
      purchaseSource,
      isDualSystem,
    } = body;

    const item = await prisma.inventory.update({
      where: {
        id: params.id,
      },
      data: {
        sku,
        brand,
        model,
        stockCount,
        lowStockThreshold,
        price,
        purchaseSource,
        isDualSystem,
      },
    });

    return NextResponse.json(item);
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

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.inventory.update({
      where: {
        id: params.id,
      },
      data: {
        status: "DELETED",
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
