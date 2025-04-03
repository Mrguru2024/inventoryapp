import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { TransponderData } from "@/app/services/transponderService";

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

interface TransponderKey {
  id: number;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: any;
  compatibleParts: any;
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const transponderType = searchParams.get("transponderType");
    const search = searchParams.get("search");

    // Build where clause based on search parameters
    const where: any = {};
    if (search) {
      where.OR = [
        {
          make: {
            contains: search,
          },
        },
        {
          model: {
            contains: search,
          },
        },
        {
          transponderType: {
            contains: search,
          },
        },
      ];
    }
    if (make) where.make = make;
    if (model) where.model = model;
    if (year) where.yearStart = parseInt(year);
    if (transponderType) where.transponderType = transponderType;

    // Fetch transponders with filtering
    const transponders = await prisma.transponderKey.findMany({
      where,
      take: 100, // Limit results to 100
      orderBy: {
        make: "asc",
      },
    });

    return NextResponse.json(transponders);
  } catch (error) {
    console.error("Error fetching transponders:", error);
    return NextResponse.json(
      { error: "Failed to fetch transponders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      make,
      model,
      yearStart,
      transponderType,
      chipType,
      compatibleParts,
      frequency,
      notes,
      dualSystem,
    } = data;

    // Validate required fields
    if (!make || !model || !yearStart || !transponderType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new transponder
    const transponder = await prisma.transponderKey.create({
      data: {
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        yearStart: Number(yearStart),
        yearEnd: data.yearEnd ? Number(data.yearEnd) : null,
        transponderType: transponderType.toUpperCase(),
        chipType: chipType || [],
        compatibleParts: compatibleParts || [],
        frequency: frequency ? frequency.toUpperCase() : "",
        notes: notes || null,
        dualSystem: dualSystem || false,
      },
    });

    return NextResponse.json(transponder);
  } catch (error) {
    console.error("Error creating transponder:", error);
    return NextResponse.json(
      { error: "Failed to create transponder" },
      { status: 500 }
    );
  }
}
