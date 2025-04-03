export enum UserRole {
  ADMIN = "ADMIN",
  TECHNICIAN = "TECHNICIAN",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
  isApproved: boolean;
}
