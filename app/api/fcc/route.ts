import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Debug: Check if prisma is initialized
    console.log("Prisma client:", prisma ? "Initialized" : "Not initialized");

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Debug: Check available models
    console.log("Available models:", Object.keys(prisma));

    const fccIds = await prisma.FCCId.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(fccIds);
  } catch (error) {
    console.error("Error in GET /api/fcc:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to fetch FCC IDs: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, description } = body;

    if (!id || !description) {
      return NextResponse.json(
        { error: "ID and description are required" },
        { status: 400 }
      );
    }

    const fccId = await prisma.FCCId.upsert({
      where: { id },
      update: { description },
      create: { id, description },
    });

    return NextResponse.json(fccId);
  } catch (error) {
    console.error("Error in POST /api/fcc:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to create/update FCC ID: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
