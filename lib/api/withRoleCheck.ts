import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export function withRoleCheck(handler: Function, allowedRoles: string[]) {
  return async function (req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return handler(req, session);
  };
} 