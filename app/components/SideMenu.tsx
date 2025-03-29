"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserRole } from "@/app/lib/auth/types";
import { hasPermission, isSuperAdmin } from "@/app/lib/auth/permissions";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  KeyIcon,
  SettingsIcon,
  UsersIcon,
  DatabaseIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react";

// Define interfaces for our menu items
interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  requiredRole?: UserRole;
  superAdminOnly?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

// Define menu items
const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: HomeIcon,
    href: "/admin",
    color: "text-blue-500",
  },
  {
    label: "Transponders",
    icon: KeyIcon,
    href: "/admin/transponders",
    color: "text-green-500",
    subItems: [
      {
        label: "Search",
        icon: SearchIcon,
        href: "/admin/transponders/search",
        color: "text-green-500",
      },
      {
        label: "Management",
        icon: DatabaseIcon,
        href: "/admin/transponders/manage",
        color: "text-green-500",
      },
    ],
  },
  {
    label: "Users",
    icon: UsersIcon,
    href: "/admin/users",
    color: "text-purple-500",
    requiredRole: UserRole.ADMIN,
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    href: "/admin/settings",
    color: "text-gray-500",
    superAdminOnly: true,
  },
];

export default function SideMenu() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  const userRole = session.user.role as UserRole;
  const isAdmin = isSuperAdmin(userRole);

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.superAdminOnly && !isAdmin) return false;
    if (item.requiredRole && userRole !== item.requiredRole) return false;
    return true;
  });

  return (
    <nav className="space-y-1">
      {filteredMenuItems.map((item) => (
        <div key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md",
              pathname === item.href
                ? "bg-gray-100 dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <item.icon className={cn("mr-3 h-5 w-5", item.color)} />
            {item.label}
          </Link>
          {item.subItems && pathname.startsWith(item.href) && (
            <div className="ml-4 mt-1 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    pathname === subItem.href
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <subItem.icon className={cn("mr-3 h-5 w-5", subItem.color)} />
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
