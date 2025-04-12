"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  MessageSquare,
  Package,
  Clock,
} from "lucide-react";
import { useMemo } from "react";

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
  adminOnly?: boolean;
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
    label: "Inventory",
    icon: Package,
    href: "/admin/inventory",
    color: "text-green-500",
    subItems: [
      {
        label: "All Inventory",
        icon: DatabaseIcon,
        href: "/admin/inventory",
        color: "text-green-500",
      },
      {
        label: "My Inventory",
        icon: Package,
        href: "/admin/inventory?view=my",
        color: "text-green-500",
      },
      {
        label: "Pending Approval",
        icon: Clock,
        href: "/admin/inventory?view=pending",
        color: "text-yellow-500",
        adminOnly: true,
      },
    ],
  },
  {
    label: "Transponders",
    icon: KeyIcon,
    href: "/admin/transponders/manage",
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
      {
        label: "FCC ID Management",
        icon: DatabaseIcon,
        href: "/admin/fcc",
        color: "text-blue-500",
      },
      {
        label: "FCC ID Validation",
        icon: SearchIcon,
        href: "/admin/fcc/validation",
        color: "text-yellow-500",
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
    label: "Chat Dashboard",
    icon: MessageSquare,
    href: "/admin/chat",
    color: "text-gray-500",
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
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Get user role from session
  const userRole = session?.user?.role as UserRole;

  // Memoize filtered menu items
  const filteredMenuItems = useMemo(() => {
    if (status !== "authenticated" || !session?.user) return [];

    const isAdmin = isSuperAdmin(userRole);

    return menuItems.filter((item) => {
      if (item.superAdminOnly && !isAdmin) return false;
      if (item.requiredRole && userRole !== item.requiredRole) return false;
      return true;
    });
  }, [session?.user, status, userRole]);

  const isActive = (href: string) => {
    const [basePath, query] = href.split("?");
    const currentView = searchParams.get("view");

    if (query) {
      const expectedView = query.split("=")[1];
      return pathname === basePath && currentView === expectedView;
    }

    return pathname === basePath && !currentView;
  };

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

  return (
    <nav className="space-y-1">
      {filteredMenuItems.map((item) => (
        <div key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150",
              isActive(item.href)
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <item.icon className={cn("mr-3 h-5 w-5", item.color)} />
            {item.label}
          </Link>
          {item.subItems && pathname.startsWith(item.href.split("?")[0]) && (
            <div className="ml-4 mt-1 space-y-1">
              {item.subItems
                .filter(
                  (subItem) =>
                    !(subItem.adminOnly && userRole !== UserRole.ADMIN)
                )
                .map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                      isActive(subItem.href)
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <subItem.icon
                      className={cn("mr-3 h-5 w-5", subItem.color)}
                    />
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
