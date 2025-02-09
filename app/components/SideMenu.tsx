'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/lib/auth/types';
import { hasPermission, isSuperAdmin } from '@/app/lib/auth/permissions';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  KeyIcon,
  SettingsIcon,
  UsersIcon,
  DatabaseIcon,
  SearchIcon,
  WrenchIcon,
  type Icon
} from 'lucide-react';

// Define interfaces for our menu items
interface MenuItem {
  label: string;
  icon: Icon;
  href: string;
  color: string;
  requiredRoles?: UserRole[];
  superAdminOnly?: boolean;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  icon: Icon;
  href: string;
  color: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Keys',
    icon: KeyIcon,
    href: '/keys',
    color: 'text-violet-500',
  },
  {
    label: 'Technician Tools',
    icon: WrenchIcon,
    href: '/technician',
    color: 'text-orange-500',
    requiredRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TECHNICIAN],
    subItems: [
      {
        label: 'Transponder Search',
        icon: SearchIcon,
        href: '/technician/transponder-search',
        color: 'text-pink-700',
      },
      {
        label: 'Key Programming',
        icon: WrenchIcon,
        href: '/technician/key-programming',
        color: 'text-green-500',
      },
    ]
  },
  {
    label: 'Users',
    icon: UsersIcon,
    href: '/users',
    color: 'text-blue-500',
    requiredRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    href: '/settings',
    color: 'text-gray-500',
    requiredRoles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  },
  {
    label: 'Personal Inventory',
    icon: DatabaseIcon,
    href: '/inventory/personal',
    color: 'text-purple-500',
    superAdminOnly: true
  },
];

export default function SideMenu() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Add console log to debug session
  console.log('Session:', session);
  console.log('Status:', status);

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

  // If no session, show limited menu
  if (!session) {
    const publicMenuItems = MENU_ITEMS.filter(item => 
      item.href === '/dashboard' || item.href === '/keys'
    );

    return (
      <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
        <div className="px-3 py-2 flex-1">
          <Link href="/dashboard" className="flex items-center pl-3 mb-14">
            <h1 className="text-2xl font-bold">
              Key Inventory
            </h1>
          </Link>
          <div className="space-y-1">
            {publicMenuItems.map((item) => (
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

  const userRole = session?.user?.role as UserRole;
  const userId = session?.user?.id;

  // Filter menu items based on user role and permissions
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    // Always show Dashboard and Keys
    if (item.href === '/dashboard' || item.href === '/keys') {
      return true;
    }

    if (item.superAdminOnly && !isSuperAdmin(userId)) {
      return false;
    }

    if (item.requiredRoles && !item.requiredRoles.includes(userRole)) {
      return false;
    }

    return hasPermission(userRole, item.href);
  });

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Key Inventory
          </h1>
        </Link>
        <div className="space-y-1">
          {filteredMenuItems.map((item) => (
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
              
              {/* Render sub-items if they exist and parent is active */}
              {item.subItems && pathname.startsWith(item.href) && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "text-sm group flex p-2 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                        pathname === subItem.href ? "text-white bg-white/10" : "text-zinc-400",
                      )}
                    >
                      <div className="flex items-center flex-1">
                        <subItem.icon className={cn("h-4 w-4 mr-3", subItem.color)} />
                        {subItem.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 