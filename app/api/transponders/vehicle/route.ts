import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const year = searchParams.get("year");

    if (!make || !model || !year) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      return NextResponse.json(
        { error: "Invalid year parameter" },
        { status: 400 }
      );
    }

    const transponder = await prisma.transponderKey.findFirst({
      where: {
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        yearStart: { lte: yearNum },
        OR: [{ yearEnd: { gte: yearNum } }, { yearEnd: null }],
      },
    });

    if (!transponder) {
      return NextResponse.json(null);
    }

    return NextResponse.json(transponder);
  } catch (error) {
    console.error("Error fetching vehicle transponder:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle transponder" },
      { status: 500 }
    );
  }
}
