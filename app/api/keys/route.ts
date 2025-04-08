import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/auth";

interface InventoryItem {
  id: string;
  sku: string;
  brand: string;
  model: string;
  stockCount: number;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TECHNICIAN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { make, model, year, keyType, transponderType, chipData, notes } =
      json;

    const key = await prisma.inventory.create({
      data: {
        make,
        model,
        year,
        keyType,
        transponderType,
        chipData,
        notes,
      },
    });

    // Serialize the response
    return NextResponse.json({
      id: key.id.toString(),
      make: key.make,
      model: key.model,
      year: key.year,
      keyType: key.keyType,
      transponderType: key.transponderType,
      chipData: key.chipData,
      notes: key.notes,
      createdAt: key.createdAt.toISOString(),
      updatedAt: key.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to create key:", error);
    return NextResponse.json(
      { error: "Failed to create key" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const inventory = await prisma.inventory.findMany({
      where: {
        OR: [
          {
            brand: {
              contains: search,
            },
          },
          {
            model: {
              contains: search,
            },
          },
          {
            sku: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        brand: "asc",
      },
      select: {
        id: true,
        sku: true,
        brand: true,
        model: true,
        stockCount: true,
        lowStockThreshold: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Serialize the data to plain objects
    const serializedInventory = inventory.map((item: InventoryItem) => ({
      id: String(item.id),
      sku: item.sku,
      make: item.brand, // Map brand to make for frontend compatibility
      model: item.model,
      stockCount: item.stockCount,
      lowStockThreshold: item.lowStockThreshold,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedInventory);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}
