'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Link from 'next/link';

interface RoleLayoutProps {
  children: ReactNode;
  allowedRoles: string[];
}

const roleMenuItems = {
  ADMIN: [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/inventory', label: 'Inventory' },
    { href: '/admin/reports', label: 'Reports' },
  ],
  TECHNICIAN: [
    { href: '/technician/dashboard', label: 'Dashboard' },
    { href: '/technician/requests', label: 'Requests' },
    { href: '/technician/inventory', label: 'Inventory' },
  ],
  CUSTOMER: [
    { href: '/customer/dashboard', label: 'Dashboard' },
    { href: '/customer/orders', label: 'Orders' },
    { href: '/customer/history', label: 'History' },
  ],
};

export default function RoleLayout({ children, allowedRoles }: RoleLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      if (!allowedRoles.includes(session.user.role)) {
        router.push('/auth/error?error=AccessDenied');
      }
    } else if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, session, allowedRoles, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.role) {
    return null;
  }

  const menuItems = roleMenuItems[session.user.role as keyof typeof roleMenuItems] || [];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h2 className="text-xl font-semibold">{session.user.role} Panel</h2>
          <p className="text-sm text-gray-400">{session.user.email}</p>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {menuItems.find((item) => item.href === router.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-6">
          {children}
        </main>
      </div>
    </div>
  );
} 