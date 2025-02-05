import RoleLayout from '@/app/components/layouts/RoleLayout';

export default function AdminDashboard() {
  return (
    <RoleLayout allowedRoles={['ADMIN']}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dashboard content */}
      </div>
    </RoleLayout>
  );
} 