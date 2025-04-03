import { NextRequest } from "next/server";
import { withRoleCheck } from "@/lib/api/withRoleCheck";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/auth/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type NotificationRouteContext = {
  params: {
    id: string;
  };
};

async function handler(req: NextRequest, context: NotificationRouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    if (!id) {
      return Response.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return Response.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== session.user.id) {
      return Response.json(
        { error: "Not authorized to update this notification" },
        { status: 403 }
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return Response.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return Response.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export const PATCH = withRoleCheck(handler, [
  UserRole.ADMIN,
  UserRole.TECHNICIAN,
]);
