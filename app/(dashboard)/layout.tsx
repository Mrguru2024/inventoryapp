import { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import QueryProvider from '@/app/components/providers/QueryProvider';
import SideMenu from '@/app/components/SideMenu';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Key Programming Assistant Dashboard',
};


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <QueryProvider>
      <div className="min-h-screen">
        <div className="flex">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 bg-gray-900">
            <SideMenu />
          </aside>

          {/* Mobile Menu */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900">
            <SideMenu />
          </div>

          {/* Main Content */}
          <main className="flex-1 lg:pl-64">
            <div className="h-full">
              {/* Mobile padding for header */}
              <div className="lg:hidden h-16" />
              
              {/* Content container */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
} 