import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { UserRole } from "@/lib/auth/types";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Auth attempt:", { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log("User found:", {
          id: user?.id,
          email: user?.email,
          hasPassword: !!user?.password,
          isApproved: user?.isApproved,
          role: user?.role,
        });

        if (!user) {
          console.log("No user found");
          throw new Error("Invalid email or password");
        }

        if (!user.isApproved) {
          console.log("User not approved");
          throw new Error("Your account is not approved yet");
        }

        const isValid = await compare(
          credentials.password,
          user.password || ""
        );

        console.log("Password validation:", { isValid });

        if (!isValid) {
          console.log("Invalid password");
          throw new Error("Invalid email or password");
        }

        console.log("Auth successful");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: true, // Always enable debug mode
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback:", { token, user });
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback:", { session, token });
      if (session?.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
