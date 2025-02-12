import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { redirect } from 'next/navigation';
import DashboardStats from '@/app/components/DashboardStats';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import { Card } from '@/app/components/ui/card';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {session.user.name}
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
          {/* Add recent activity component */}
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          {/* Add quick actions component */}
        </Card>
      </div>
    </div>
  );
} 