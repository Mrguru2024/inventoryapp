import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid transponder ID" },
        { status: 400 }
      );
    }

    const transponder = await prisma.transponderKey.findUnique({
      where: { id },
    });

    if (!transponder) {
      return NextResponse.json(
        { error: "Transponder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transponder.chipType);
  } catch (error) {
    console.error("Error fetching compatible chips:", error);
    return NextResponse.json(
      { error: "Failed to fetch compatible chips" },
      { status: 500 }
    );
  }
}
