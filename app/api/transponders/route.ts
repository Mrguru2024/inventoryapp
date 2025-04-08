import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { TransponderData } from "@/app/services/transponderService";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

interface TransponderKey {
  id: string;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: string | string[];
  compatibleParts: string | string[];
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
  fccId?: string | null;
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

    // Fetch all transponders and filter in memory for case-insensitivity
    const allTransponders = await prisma.transponderKey.findMany({
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    console.log(`Fetched ${allTransponders.length} transponders from database`);

    // Apply filters manually
    let filteredTransponders = allTransponders;

    if (make) {
      console.log(`Filtering by make: "${make}"`);
      filteredTransponders = filteredTransponders.filter(
        (t) => t.make.toLowerCase() === make.toLowerCase()
      );
      console.log(
        `After make filter: ${filteredTransponders.length} transponders`
      );
    }

    if (model) {
      console.log(`Filtering by model: "${model}"`);
      filteredTransponders = filteredTransponders.filter(
        (t) => t.model.toLowerCase() === model.toLowerCase()
      );
      console.log(
        `After model filter: ${filteredTransponders.length} transponders`
      );
    }

    if (year) {
      console.log(`Filtering by year: "${year}"`);
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        filteredTransponders = filteredTransponders.filter(
          (t) => t.yearStart === yearNum
        );
        console.log(
          `After year filter: ${filteredTransponders.length} transponders`
        );
      }
    }

    if (transponderType) {
      console.log(`Filtering by transponderType: "${transponderType}"`);
      filteredTransponders = filteredTransponders.filter(
        (t) => t.transponderType.toLowerCase() === transponderType.toLowerCase()
      );
      console.log(
        `After transponder type filter: ${filteredTransponders.length} transponders`
      );
    }

    // Transform the data to handle both string and array formats
    const transformedTransponders = filteredTransponders.map(
      transformTransponderData
    );

    console.log(
      `Returning ${transformedTransponders.length} filtered transponders`
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
  // Extract chip types from comma-separated string or use existing array
  const chipType = Array.isArray(transponder.chipType)
    ? transponder.chipType
    : typeof transponder.chipType === "string"
    ? transponder.chipType.split(",").map((c: string) => c.trim())
    : [];

  // Extract compatible parts from comma-separated string or use existing array
  const compatibleParts = Array.isArray(transponder.compatibleParts)
    ? transponder.compatibleParts
    : typeof transponder.compatibleParts === "string"
    ? transponder.compatibleParts.split(",").map((p: string) => p.trim())
    : [];

  return {
    ...transponder,
    chipType,
    compatibleParts,
    fccId: transponder.fccId || "",
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

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing transponder ID" },
        { status: 400 }
      );
    }

    // Clean up the update data
    const cleanedData: Partial<TransponderData> = {};

    if (updateData.make) cleanedData.make = updateData.make.toUpperCase();
    if (updateData.model) cleanedData.model = updateData.model.toUpperCase();
    if (updateData.yearStart)
      cleanedData.yearStart = Number(updateData.yearStart);
    if (updateData.yearEnd) cleanedData.yearEnd = Number(updateData.yearEnd);
    if (updateData.transponderType)
      cleanedData.transponderType = updateData.transponderType.toUpperCase();
    if (updateData.chipType) cleanedData.chipType = updateData.chipType;
    if (updateData.compatibleParts)
      cleanedData.compatibleParts = updateData.compatibleParts;
    if (updateData.frequency)
      cleanedData.frequency = updateData.frequency.toUpperCase();
    if (updateData.notes !== undefined) cleanedData.notes = updateData.notes;
    if (updateData.dualSystem !== undefined)
      cleanedData.dualSystem = updateData.dualSystem;
    if (updateData.fccId !== undefined) cleanedData.fccId = updateData.fccId;

    // Update transponder
    const updatedTransponder = await prisma.transponderKey.update({
      where: { id },
      data: cleanedData,
    });

    return NextResponse.json(transformTransponderData(updatedTransponder));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Transponder not found" },
          { status: 404 }
        );
      }
    }
    console.error("Error updating transponder:", error);
    return NextResponse.json(
      { error: "Failed to update transponder" },
      { status: 500 }
    );
  }
}
