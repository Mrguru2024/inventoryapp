'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function SessionWrapper({ children }: { children: ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
} 