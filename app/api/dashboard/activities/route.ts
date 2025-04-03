import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/auth/types";

type ActivitiesRouteContext = {
  params: Record<string, string | string[]>;
};

async function handler(req: NextRequest, context: ActivitiesRouteContext) {
  try {
    const activities = await prisma.activity.findMany({
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
