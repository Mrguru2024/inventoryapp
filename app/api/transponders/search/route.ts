import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { tryParseJSON } from "../../../lib/utils";

interface TransponderData {
  id: number;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
  transponderType: string;
  chipType: string[];
  compatibleParts: string[];
  frequency: string | null;
  notes: string | null;
  dualSystem: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const type = searchParams.get("type");

    // Build the where clause
    const whereClause: Prisma.TransponderKeyWhereInput = {};

    // Add search query conditions
    if (query) {
      whereClause.OR = [
        { make: { contains: query.toUpperCase() } },
        { model: { contains: query.toUpperCase() } },
        { transponderType: { contains: query.toUpperCase() } },
        { chipType: { contains: query.toUpperCase() } },
        { compatibleParts: { contains: query.toUpperCase() } },
      ];
    }

    // Add filter conditions
    if (make) {
      whereClause.make = { equals: make.toUpperCase() };
    }
    if (model) {
      whereClause.model = { equals: model.toUpperCase() };
    }
    if (year) {
      const yearNum = parseInt(year);
      whereClause.AND = [
        { yearStart: { lte: yearNum } },
        {
          OR: [{ yearEnd: { gte: yearNum } }, { yearEnd: null }],
        },
      ];
    }
    if (type) {
      whereClause.transponderType = { equals: type.toUpperCase() };
    }

    // Fetch transponders with the constructed where clause
    const transponders = await prisma.transponderKey.findMany({
      where: whereClause,
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    // Transform the data
    const formattedTransponders: TransponderData[] = transponders.map(
      (transponder) => ({
        id: transponder.id,
        make: transponder.make,
        model: transponder.model,
        yearStart: transponder.yearStart,
        yearEnd: transponder.yearEnd,
        transponderType: transponder.transponderType,
        chipType: tryParseJSON(transponder.chipType),
        compatibleParts: tryParseJSON(transponder.compatibleParts),
        frequency: transponder.frequency,
        notes: transponder.notes,
        dualSystem: transponder.dualSystem,
      })
    );

    // Log the number of unique manufacturers found
    const uniqueManufacturers = Array.from(
      new Set(formattedTransponders.map((t: TransponderData) => t.make))
    );
    console.log(
      `Found ${
        uniqueManufacturers.length
      } unique manufacturers: ${uniqueManufacturers.join(", ")}`
    );

    return NextResponse.json(formattedTransponders);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search transponders" },
      { status: 500 }
    );
  }
}
