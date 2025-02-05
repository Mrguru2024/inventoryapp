import dynamic from 'next/dynamic';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const RoleLayout = dynamic(() => import('@/app/components/layouts/RoleLayout'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function AdminDashboard() {
  return (
    <RoleLayout allowedRoles={['ADMIN']}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {/* Dashboard content */}
      </div>
    </RoleLayout>
  );
} 