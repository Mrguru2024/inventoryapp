'use client';

import { ErrorBoundary } from './ErrorBoundary';
import { Providers } from '../providers';
import { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Providers>
          <div suppressHydrationWarning>
            {children}
          </div>
        </Providers>
      </Suspense>
    </ErrorBoundary>
  );
} 