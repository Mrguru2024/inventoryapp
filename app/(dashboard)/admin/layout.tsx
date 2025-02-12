import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <AdminNavLinks />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLinks() {
  const links = [
    { href: '/admin', label: 'Overview', icon: 'GridIcon' },
    { href: '/admin/users', label: 'User Management', icon: 'UsersIcon' },
    { href: '/admin/keys', label: 'Key Inventory', icon: 'KeyIcon' },
    { href: '/admin/orders', label: 'Orders', icon: 'ShoppingCartIcon' },
    { href: '/admin/analytics', label: 'Analytics', icon: 'ChartIcon' },
    { href: '/admin/settings', label: 'Settings', icon: 'SettingsIcon' },
  ];

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
} 