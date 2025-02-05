export type Permission = 
  | 'view:users'
  | 'create:users'
  | 'edit:users'
  | 'delete:users'
  | 'view:inventory'
  | 'create:inventory'
  | 'edit:inventory'
  | 'delete:inventory'
  | 'view:requests'
  | 'create:requests'
  | 'approve:requests'
  | 'reject:requests'
  | 'view:reports'
  | 'generate:reports';

export type RolePermissions = {
  [key: string]: Permission[];
}; 