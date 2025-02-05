'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { hasPermission } from '@/lib/permissions/rolePermissions';
import type { Permission } from '@/lib/permissions/types';

interface PermissionGuardProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
}

export default function PermissionGuard({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGuardProps) {
  const { data: session } = useSession();
  const role = session?.user?.role as string;

  if (!role || !hasPermission(role, permission)) {
    return fallback;
  }

  return <>{children}</>;
} 