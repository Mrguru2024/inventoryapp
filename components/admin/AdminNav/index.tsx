"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Requests",
    href: "/admin/requests",
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (item.href === "/admin/users" && session?.user?.role !== "ADMIN") {
      return false;
    }
    return true;
  });

  const isInventoryActive = pathname?.startsWith("/admin/inventory");

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isInventoryActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                Inventory
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/inventory"
                    className={cn(
                      "w-full",
                      pathname === "/admin/inventory" && "text-primary"
                    )}
                  >
                    All Inventory
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/inventory/my"
                    className={cn(
                      "w-full",
                      pathname === "/admin/inventory/my" && "text-primary"
                    )}
                  >
                    My Inventory
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
