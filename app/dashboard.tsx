import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import TechnicianDashboard from './components/TechnicianDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect to login if not authenticated
    redirect('/');
  }

  const { role } = session.user;

  switch (role) {
    case 'TECHNICIAN':
      return <TechnicianDashboard />;
    case 'CUSTOMER':
      return <CustomerDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    default:
      return <div>Access Denied</div>;
  }
} 