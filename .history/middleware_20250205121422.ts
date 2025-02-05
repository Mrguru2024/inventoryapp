import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';
import { roleCheck } from './middleware/roleCheck';

export default async function middleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl;

  // Public paths
  if (pathname.startsWith('/auth/') || pathname === '/') {
    return NextResponse.next();
  }

  // Role-specific paths
  if (pathname.startsWith('/admin/')) {
    return roleCheck(request, ['ADMIN']);
  }

  if (pathname.startsWith('/technician/')) {
    return roleCheck(request, ['TECHNICIAN', 'ADMIN']);
  }

  if (pathname.startsWith('/customer/')) {
    return roleCheck(request, ['CUSTOMER']);
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