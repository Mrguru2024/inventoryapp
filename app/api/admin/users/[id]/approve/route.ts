import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { prisma } from "@/app/lib/prisma";
import { UserRole } from "@/app/lib/auth/types";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const userId = context.params.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { error: "Failed to approve user" },
      { status: 500 }
    );
  }
}
