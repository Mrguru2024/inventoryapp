import { withRoleCheck } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

async function handler(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    return Response.json(user);
  } catch (error) {
    console.error("Error approving user:", error);
    return Response.json({ error: "Failed to approve user" }, { status: 500 });
  }
}

export const POST = withRoleCheck(handler, "ADMIN");
