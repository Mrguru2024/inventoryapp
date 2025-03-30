import { NextRequest, NextResponse } from "next/server";
import { TransponderFilters } from "@/app/lib/domain/value-objects";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const filters: TransponderFilters = await request.json();

    // Build the where clause for Prisma
    const where: any = {};

    if (filters.make) {
      where.make = filters.make.name.toUpperCase();
    }

    if (filters.model) {
      where.model = filters.model.name.toUpperCase();
    }

    if (filters.year) {
      const year = parseInt(filters.year);
      where.OR = [
        { yearStart: { lte: year } },
        { yearEnd: { gte: year } },
        { yearStart: { lte: year }, yearEnd: null },
      ];
    }

    if (filters.transponderType) {
      where.transponderType = filters.transponderType.code;
    }

    // Query the database
    const transponders = await prisma.transponderKey.findMany({
      where,
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    // Transform the data to match the expected format
    const transformedTransponders = transponders.map((t) => ({
      id: t.id.toString(),
      make: { id: t.id, name: t.make },
      model: { id: t.id, name: t.model, makeId: t.id },
      yearStart: t.yearStart,
      yearEnd: t.yearEnd,
      transponderType: t.transponderType,
      chipTypes: t.chipType as string[],
      compatibleParts: t.compatibleParts as string[],
      frequency: t.frequency,
      notes: t.notes,
      dualSystem: t.dualSystem,
    }));

    // Apply text search if searchTerm is provided
    let filteredTransponders = transformedTransponders;
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredTransponders = transformedTransponders.filter(
        (t) =>
          t.make.name.toLowerCase().includes(searchTerm) ||
          t.model.name.toLowerCase().includes(searchTerm) ||
          t.transponderType.toLowerCase().includes(searchTerm) ||
          t.chipTypes.some((chip) => chip.toLowerCase().includes(searchTerm)) ||
          t.compatibleParts.some((part) =>
            part.toLowerCase().includes(searchTerm)
          ) ||
          (t.notes && t.notes.toLowerCase().includes(searchTerm))
      );
    }

    return NextResponse.json(filteredTransponders);
  } catch (error) {
    console.error("Error searching transponders:", error);
    return NextResponse.json(
      { error: "Failed to search transponders" },
      { status: 500 }
    );
  }
}
