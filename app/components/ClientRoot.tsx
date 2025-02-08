'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </ThemeProvider>
    </SessionProvider>
  );
} 