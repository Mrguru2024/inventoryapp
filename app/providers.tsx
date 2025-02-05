'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Suspense fallback={<LoadingSpinner />}>
          <div suppressHydrationWarning>
            {children}
          </div>
        </Suspense>
      </ThemeProvider>
    </SessionProvider>
  );
} 