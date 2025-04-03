import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";

type Handler<T = { [key: string]: string }> = (
  request: Request,
  context: { params: T }
) => Promise<Response>;

export function withRoleCheck<T = { [key: string]: string }>(
  handler: Handler<T>,
  requiredRole: string
) {
  return async (request: Request, context: { params: T }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== requiredRole) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, context);
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
