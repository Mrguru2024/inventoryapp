import { UserRole } from './types';

export function hasPermission(role: UserRole, path: string): boolean {
  // Always allow dashboard and keys pages
  if (path === '/dashboard' || path === '/keys') {
    return true;
  }

  switch (role) {
    case UserRole.SUPER_ADMIN:
      return true;
    case UserRole.ADMIN:
      return !path.includes('/inventory/personal');
    case UserRole.TECHNICIAN:
      return path.startsWith('/technician');
    case UserRole.USER:
      return false;
    default:
      return false;
  }
}

export function isSuperAdmin(userId: string | undefined): boolean {
  // Implement your super admin check logic here
  return false; // Default to false for safety
}

export { UserRole }; 