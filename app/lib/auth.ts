import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth.config";

type Handler = (
  request: Request,
  params: { params: { [key: string]: string } }
) => Promise<NextResponse>;

export function withRoleCheck(handler: Handler, requiredRole: string) {
  return async (
    request: Request,
    params: { params: { [key: string]: string } }
  ) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== requiredRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, params);
  };
}
