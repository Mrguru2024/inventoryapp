import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/lib/auth/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const items = await prisma.inventory.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "admin") {
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

    const item = await prisma.inventory.create({
      data: {
        sku,
        brand,
        model,
        stockCount,
        lowStockThreshold,
        price,
        purchaseSource,
        isDualSystem,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  if (userRole !== "ADMIN" && userRole !== "TECHNICIAN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing inventory ID" },
        { status: 400 }
      );
    }

    const inventory = await prisma.inventory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = session.user.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing inventory ID" },
        { status: 400 }
      );
    }

    await prisma.inventory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return NextResponse.json(
      { error: "Failed to delete inventory" },
      { status: 500 }
    );
  }
}
