import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

interface TransponderKey {
  id: number;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: string;
  compatibleParts: string | null;
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toUpperCase() || "";
    const make = searchParams.get("make")?.toUpperCase() || "";
    const model = searchParams.get("model")?.toUpperCase() || "";
    const year = searchParams.get("year");
    const transponderType = searchParams.get("type") || "";

    const where: Prisma.TransponderKeyWhereInput = {};
    const conditions: Prisma.TransponderKeyWhereInput[] = [];

    // Handle make filter - ensure exact match
    if (make) {
      where.make = make;
    }

    // Handle model filter - ensure exact match
    if (model) {
      where.model = model;
    }

    // Handle year filter
    if (year) {
      const yearNum = parseInt(year);
      where.OR = [
        { yearStart: { lte: yearNum }, yearEnd: { gte: yearNum } },
        { yearStart: { lte: yearNum }, yearEnd: null },
      ];
    }

    // Handle transponder type filter
    if (transponderType) {
      where.transponderType = transponderType;
    }

    // Handle search term - only apply if no make is selected
    if (search && !make) {
      conditions.push(
        { make: { contains: search } },
        { model: { contains: search } },
        { transponderType: { contains: search } }
      );
      where.OR = conditions;
    }

    const transponders = await prisma.transponderKey.findMany({
      where,
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    // Transform the data to match the expected format
    const transformedData = transponders.map((t) => ({
      id: t.id.toString(),
      make: t.make,
      model: t.model,
      yearStart: t.yearStart,
      yearEnd: t.yearEnd,
      transponderType: t.transponderType,
      chipType: t.chipType ? JSON.parse(t.chipType) : [],
      compatibleParts: t.compatibleParts ? JSON.parse(t.compatibleParts) : [],
      frequency: t.frequency,
      notes: t.notes,
      dualSystem: t.dualSystem,
    }));

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching transponders:", error);
    return NextResponse.json(
      { error: "Failed to fetch transponder data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { make, model, chipType, compatibleParts, ...rest } = data;

    // Ensure make and model are uppercase
    const transponderData = {
      ...rest,
      make: make.toUpperCase(),
      model: model.toUpperCase(),
      chipType: JSON.stringify(chipType),
      compatibleParts: JSON.stringify(compatibleParts),
    };

    const transponder = await prisma.transponderKey.create({
      data: transponderData,
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

// Helper function to safely parse JSON
function tryParseJSON<T>(
  jsonString: string | null | undefined,
  defaultValue: T
): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}
