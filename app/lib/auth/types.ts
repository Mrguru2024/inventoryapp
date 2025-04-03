import { DefaultSession } from "next-auth";

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

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}
