import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === '/';
    const role = req.nextauth.token?.role?.toLowerCase();

    // Handle root/login page
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    // Require authentication for all routes
    if (!isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protect admin-only routes
    const adminOnlyPaths = ['/users', '/settings'];
    if (adminOnlyPaths.some(path => req.nextUrl.pathname.startsWith(path)) && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/users/:path*',
    '/settings/:path*',
    '/key-programming/:path*',
  ]
}; 