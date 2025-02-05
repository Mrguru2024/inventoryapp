import { Permission, RolePermissions } from './types';

export const rolePermissions: RolePermissions = {
  ADMIN: [
    'view:users',
    'create:users',
    'edit:users',
    'delete:users',
    'view:inventory',
    'create:inventory',
    'edit:inventory',
    'delete:inventory',
    'view:requests',
    'approve:requests',
    'reject:requests',
    'view:reports',
    'generate:reports',
  ],
  TECHNICIAN: [
    'view:inventory',
    'create:requests',
    'view:requests',
    'view:reports',
  ],
  CUSTOMER: [
    'view:inventory',
    'create:requests',
    'view:requests',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
} 