import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface TransponderType {
  transponderType: string;
}

export async function GET() {
  try {
    // Get distinct transponder types
    const transponderTypes = await prisma.transponderKey.findMany({
      distinct: ["transponderType"],
      select: {
        transponderType: true,
      },
    });

    // Extract just the type strings
    const types = transponderTypes.map(
      (t: TransponderType) => t.transponderType
    );

    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching transponder types:", error);
    return NextResponse.json(
      { error: "Failed to fetch transponder types" },
      { status: 500 }
    );
  }
}
