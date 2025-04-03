import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/auth/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ActivitiesRouteContext = {
  params: Record<string, string | string[]>;
};

async function handler(req: NextRequest, context: ActivitiesRouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      where: {
        userId: session.user.id,
      },
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return Response.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return Response.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export const GET = withRoleCheck(handler, [
  UserRole.ADMIN,
  UserRole.TECHNICIAN,
]);
