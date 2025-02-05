import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based route protection
  const role = token.role as string;
  
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/technician') && role !== 'TECHNICIAN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/customer') && role !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 