import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid inventory ID" },
        { status: 400 }
      );
    }

    const updatedInventory = await prisma.transponderInventory.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
