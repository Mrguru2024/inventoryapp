import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    // Get unique transponder types from the database
    const transponderTypes = await prisma.transponderKey.findMany({
      select: {
        transponderType: true,
      },
      distinct: ["transponderType"],
      orderBy: {
        transponderType: "asc",
      },
    });

    // Extract just the type strings
    const types = transponderTypes.map((t) => t.transponderType);

    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching transponder types:", error);
    return NextResponse.json(
      { error: "Failed to fetch transponder types" },
      { status: 500 }
    );
  }
}
