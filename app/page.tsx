import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';
import LoginFormWrapper from './components/LoginFormWrapper';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already authenticated
  if (session) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin/dashboard'); // Redirect to admin dashboard
    } else if (session.user.role === 'TECHNICIAN') {
      redirect('/technician/dashboard'); // Redirect to technician dashboard
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginFormWrapper />
    </div>
  );
} 