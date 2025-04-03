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

    console.log("API Request params:", { make, model, year, transponderType });

    // If no search parameters provided, return limited results
    if (!make && !model && !year && !transponderType) {
      console.log("No search parameters provided, returning limited results");
      const allTransponders = await prisma.transponderKey.findMany({
        orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
        take: 100, // Limit results when no filters applied
      });

      // Transform the data to handle both string and array formats
      const transformedTransponders = allTransponders.map(
        transformTransponderData
      );
      console.log(
        `Returning ${transformedTransponders.length} transponders (no filters)`
      );
      return NextResponse.json(transformedTransponders);
    }

    // Build Prisma where condition for exact matches with case insensitivity
    const whereCondition: Prisma.TransponderKeyWhereInput = {};

    if (make) {
      whereCondition.make = {
        equals: make,
        mode: "insensitive", // Case insensitive comparison
      };
    }

    if (model) {
      whereCondition.model = {
        equals: model,
        mode: "insensitive", // Case insensitive comparison
      };
    }

    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        whereCondition.yearStart = yearNum;
      } else {
        console.warn(`Invalid year value: "${year}"`);
      }
    }

    if (transponderType) {
      whereCondition.transponderType = {
        equals: transponderType,
        mode: "insensitive", // Case insensitive comparison
      };
    }

    console.log(
      "Querying with where condition:",
      JSON.stringify(whereCondition)
    );

    // Fetch transponders with Prisma directly using the where condition
    const filteredTransponders = await prisma.transponderKey.findMany({
      where: whereCondition,
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
      take: 1000, // Increase limit for filtered results
    });

    console.log(
      `Found ${filteredTransponders.length} transponders matching the filters`
    );

    // Transform the data to handle both string and array formats
    const transformedTransponders = filteredTransponders.map(
      transformTransponderData
    );

    return NextResponse.json(transformedTransponders);
  } catch (error) {
    console.error("Error fetching transponders:", error);
    return NextResponse.json(
      { error: "Failed to fetch transponders" },
      { status: 500 }
    );
  }
}

// Helper function to transform transponder data
function transformTransponderData(transponder: TransponderKey) {
  // Extract chip types from comma-separated string
  const chipType = transponder.chipType
    ? transponder.chipType.split(",").map((c) => c.trim())
    : [];

  // Extract compatible parts from comma-separated string
  const compatibleParts = transponder.compatibleParts
    ? transponder.compatibleParts.split(",").map((p) => p.trim())
    : [];

  return {
    ...transponder,
    chipType,
    compatibleParts,
  };
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
