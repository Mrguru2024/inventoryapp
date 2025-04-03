import { NextRequest, NextResponse } from "next/server";
import { TransponderFilters } from "@/app/lib/domain/value-objects";
import { prisma } from "@/app/lib/prisma";

interface Transponder {
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
}

interface TransformedTransponder {
  id: string;
  make: { id: string; name: string };
  model: { id: string; name: string; makeId: string };
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipTypes: string[];
  compatibleParts: string[];
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const filters: TransponderFilters = await request.json();

    // Build where clause based on search parameters
    const where: any = {};
    if (filters.searchTerm) {
      where.OR = [
        {
          make: {
            contains: filters.searchTerm,
          },
        },
        {
          model: {
            contains: filters.searchTerm,
          },
        },
        {
          transponderType: {
            contains: filters.searchTerm,
          },
        },
      ];
    }
    if (filters.make) where.make = filters.make.name.toUpperCase();
    if (filters.model) where.model = filters.model.name.toUpperCase();
    if (filters.year) {
      const year = parseInt(filters.year);
      where.OR = [
        { yearStart: { lte: year } },
        { yearEnd: { gte: year } },
        { yearStart: { lte: year }, yearEnd: null },
      ];
    }
    if (filters.transponderType)
      where.transponderType = filters.transponderType.code;

    // Fetch transponders with filtering
    const transponders = await prisma.transponderKey.findMany({
      where,
      select: {
        id: true,
        make: true,
        model: true,
        yearStart: true,
        yearEnd: true,
        transponderType: true,
        chipType: true,
        compatibleParts: true,
        frequency: true,
        notes: true,
        dualSystem: true,
      },
      orderBy: {
        make: "asc",
      },
      take: 100, // Limit results to 100
    });

    // Transform the data to match the expected format
    const transformedTransponders = transponders.map((t: Transponder) => ({
      id: t.id.toString(),
      make: { id: t.id, name: t.make },
      model: { id: t.id, name: t.model, makeId: t.id },
      yearStart: t.yearStart,
      yearEnd: t.yearEnd,
      transponderType: t.transponderType,
      chipTypes: Array.isArray(t.chipType) ? t.chipType : [t.chipType],
      compatibleParts: Array.isArray(t.compatibleParts)
        ? t.compatibleParts
        : [t.compatibleParts],
      frequency: t.frequency,
      notes: t.notes,
      dualSystem: t.dualSystem,
    }));

    // Apply text search if searchTerm is provided
    let filteredTransponders = transformedTransponders;
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredTransponders = transformedTransponders.filter(
        (t: TransformedTransponder) =>
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
