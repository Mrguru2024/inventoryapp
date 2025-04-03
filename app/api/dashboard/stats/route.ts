import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/auth/types";
import { subDays } from "date-fns";

type StatsRouteContext = {
  params: Record<string, string | string[]>;
};

async function handler(req: NextRequest, context: StatsRouteContext) {
  try {
    const [totalInventory, pendingApprovals, lowStock, recentOrders] =
      await Promise.all([
        prisma.inventory.count(),
        prisma.user.count({
          where: { isApproved: false },
        }),
        prisma.inventory.count({
          where: { stockCount: { lt: 10 } },
        }),
        prisma.request.count({
          where: {
            createdAt: {
              gte: subDays(new Date(), 7),
            },
          },
        }),
      ]);

    return Response.json({
      totalInventory,
      pendingApprovals,
      lowStock,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return Response.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

export const GET = withRoleCheck(handler, [
  UserRole.ADMIN,
  UserRole.TECHNICIAN,
]);
