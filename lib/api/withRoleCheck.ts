import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { UserRole } from "@/app/lib/auth/types";

export function withRoleCheck<T extends { params: Record<string, any> }>(
  handler: (request: NextRequest, context: T) => Promise<Response>,
  requiredRole: UserRole | UserRole[]
) {
  return async function (request: NextRequest, context: T) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(session.user.role as UserRole)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return handler(request, context);
  };
}
