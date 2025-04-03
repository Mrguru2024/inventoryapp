import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { barcode: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const key = await prisma.transponderKey.findUnique({
      where: {
        barcode: params.barcode,
      },
    });

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    return NextResponse.json(key);
  } catch (error) {
    console.error("Error searching for key:", error);
    return NextResponse.json(
      { error: "Failed to search for key" },
      { status: 500 }
    );
  }
}
