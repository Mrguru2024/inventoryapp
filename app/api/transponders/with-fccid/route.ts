import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Add cache headers
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Get all transponders that have non-null FCC IDs
    const transponders = await prisma.transponderKey.findMany({
      where: {
        fccId: {
          not: null,
        },
      },
      orderBy: [{ make: "asc" }, { model: "asc" }, { yearStart: "desc" }],
    });

    // Transform the data to handle both string and array formats
    const transformedTransponders = transponders.map((transponder) => {
      // Handle chipType based on its type
      const chipType =
        typeof transponder.chipType === "string"
          ? transponder.chipType.split(",").map((c: string) => c.trim())
          : transponder.chipType || [];

      // Handle compatibleParts based on its type
      const compatibleParts =
        typeof transponder.compatibleParts === "string"
          ? transponder.compatibleParts.split(",").map((p: string) => p.trim())
          : transponder.compatibleParts || [];

      return {
        ...transponder,
        chipType,
        compatibleParts,
      };
    });

    console.log(
      `Found ${transformedTransponders.length} transponders with FCC IDs`
    );
    return NextResponse.json(transformedTransponders);
  } catch (error) {
    console.error("Error fetching transponders with FCC IDs:", error);
    return NextResponse.json(
      { error: "Failed to fetch transponders with FCC IDs" },
      { status: 500 }
    );
  }
}
