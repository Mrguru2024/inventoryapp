"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { QrCode, ClipboardList, Settings, Search, Key } from "lucide-react";

export function TechnicianNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/technician/dashboard",
      icon: (
        <svg
          className="h-6 w-6 text-gray-400 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Keys",
      href: "/keys",
      icon: <Key className="h-6 w-6 text-gray-400 dark:text-gray-300" />,
    },
    {
      title: "Transponder Search",
      href: "/technician/transponder-search",
      icon: <Search className="h-6 w-6 text-gray-400 dark:text-gray-300" />,
    },
    {
      title: "Barcode Scanner",
      href: "/technician/scanner",
      icon: <QrCode className="h-6 w-6 text-gray-400 dark:text-gray-300" />,
    },
    {
      title: "Scan History",
      href: "/technician/history",
      icon: (
        <ClipboardList className="h-6 w-6 text-gray-400 dark:text-gray-300" />
      ),
    },
    {
      title: "Settings",
      href: "/technician/settings",
      icon: <Settings className="h-6 w-6 text-gray-400 dark:text-gray-300" />,
    },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white group",
            pathname === item.href
              ? "bg-gray-50 dark:bg-gray-700"
              : "transparent"
          )}
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
