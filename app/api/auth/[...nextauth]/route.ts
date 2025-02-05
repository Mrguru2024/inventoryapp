import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
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
          console.log('No user found:', credentials.email);
          throw new Error('No user found');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.log('Invalid password for user:', credentials.email);
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
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' || account?.provider === 'github') {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email! },
            create: {
              email: user.email!,
              name: user.name!,
              role: 'TECHNICIAN',
              emailVerified: new Date(),
            },
            update: {}
          });
          token.role = dbUser.role;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          token.role = dbUser?.role || 'TECHNICIAN';
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! }
        });
        session.user.emailVerified = user?.emailVerified;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 