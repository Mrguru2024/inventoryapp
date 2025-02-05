import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function roleCheck(request: NextRequest, allowedRoles: string[]) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!allowedRoles.includes(token.role as string)) {
    return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', request.url));
  }

  return NextResponse.next();
} 