import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('No user found');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' || account?.provider === 'github') {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email! },
            create: {
              email: user.email!,
              name: user.name!,
              role: 'CUSTOMER',
              emailVerified: new Date(),
            },
            update: {}
          });
          token.role = dbUser.role;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          token.role = dbUser?.role || 'CUSTOMER';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! }
        });
        session.user.emailVerified = user?.emailVerified;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });
        return !!dbUser?.emailVerified;
      }
      return true;
    }
  }
});

export { handler as GET, handler as POST }; 