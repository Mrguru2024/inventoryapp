import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function GET() {
  try {
    const transponders = await prisma.transponderKey.findMany({
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
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
