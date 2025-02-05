'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { rolePermissions } from '@/lib/permissions/rolePermissions';

const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/forgot-password'];

export default function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session && !publicPaths.includes(pathname!)) {
      router.push('/');
      return;
    }

    if (session?.user?.role) {
      const role = session.user.role;
      const permissions = rolePermissions[role] || [];

      // Check path against role permissions
      if (pathname?.startsWith('/admin') && role !== 'ADMIN') {
        router.push('/auth/error?error=AccessDenied');
      } else if (pathname?.startsWith('/technician') && !['ADMIN', 'TECHNICIAN'].includes(role)) {
        router.push('/auth/error?error=AccessDenied');
      } else if (pathname?.startsWith('/customer') && role !== 'CUSTOMER') {
        router.push('/auth/error?error=AccessDenied');
      }
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
} 