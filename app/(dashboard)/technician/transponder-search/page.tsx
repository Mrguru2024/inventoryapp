import { Suspense } from 'react';
import TransponderSearch from '@/app/components/TransponderSearch';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import TransponderImport from '@/app/components/TransponderImport';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function TransponderSearchPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TECHNICIAN') {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transponder Database</h1>
      <TransponderImport />
      <Suspense fallback={<LoadingSpinner />}>
        <div className="w-full">
          <TransponderSearch />
        </div>
      </Suspense>
    </div>
  );
} 