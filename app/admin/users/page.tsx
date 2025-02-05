'use client';

import { PermissionGuard } from '@/app/components/guards/PermissionGuard';
import RoleLayout from '@/app/components/layouts/RoleLayout';

export default function UsersPage() {
  return (
    <RoleLayout allowedRoles={['ADMIN']}>
      <PermissionGuard permission="view:users">
        <div className="space-y-6">
          <PermissionGuard 
            permission="create:users"
            fallback={<p>You don't have permission to create users</p>}
          >
            <button className="btn-primary">Add User</button>
          </PermissionGuard>

          {/* User list */}
        </div>
      </PermissionGuard>
    </RoleLayout>
  );
} 