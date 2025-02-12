'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/lib/auth/types';
import { hasPermission } from '@/app/lib/auth/permissions';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Key,
  Search,
  Database,
  type Icon
} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: Icon;
  href: string;
  color: string;
  requiredRoles?: UserRole[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-blue-500',
  },
  {
    label: 'Keys',
    icon: Key,
    href: '/keys',
    color: 'text-violet-500',
  },
  {
    label: 'Transponder Search',
    icon: Search,
    href: '/transponder-search',
    color: 'text-pink-500',
  },
  {
    label: 'Transponder Database',
    icon: Database,
    href: '/transponder-database',
    color: 'text-indigo-500',
  }
];

export default function SideMenu() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Key Inventory
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Key Inventory
          </h1>
        </div>
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === item.href ? "text-white bg-white/10" : "text-zinc-400",
                )}
              >
                <div className="flex items-center flex-1">
                  <item.icon className={cn("h-5 w-5 mr-3", item.color)} />
                  {item.label}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 