import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRole = session.user.role;
    let where = {};
    const include = {
      technician: {
        select: {
          name: true,
        },
      },
      createdByUser: {
        select: {
          name: true,
        },
      },
    };

    if (userRole === "TECHNICIAN") {
      where = {
        OR: [{ technicianId: session.user.id }, { status: "APPROVED" }],
      };
    } else if (userRole === "USER") {
      where = {
        status: "APPROVED",
      };
    }

    const inventory = await prisma.inventory.findMany({
      where,
      include,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const {
      sku,
      brand,
      model,
      stockCount,
      lowStockThreshold,
      price,
      fccId,
      frequency,
      purchaseSource,
      isSmartKey,
      isTransponderKey,
      carMake,
      carModel,
      carYear,
      notes,
    } = data;

    // Validate required fields
    if (
      !sku ||
      !brand ||
      !model ||
      stockCount === undefined ||
      lowStockThreshold === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingItem = await prisma.inventory.findUnique({
      where: { sku },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    const createData = {
      sku,
      brand,
      model,
      stockCount,
      lowStockThreshold,
      price,
      fccId,
      frequency,
      purchaseSource,
      isSmartKey,
      isTransponderKey,
      carMake,
      carModel,
      carYear,
      notes,
      status: userRole === "ADMIN" ? "APPROVED" : "PENDING",
      technician: {
        connect: {
          id: session.user.id,
        },
      },
      createdByUser: {
        connect: {
          id: session.user.id,
        },
      },
    };

    // Create inventory item
    const inventory = await prisma.inventory.create({
      data: createData,
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error creating inventory:", error);
    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 500 }
    );
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
