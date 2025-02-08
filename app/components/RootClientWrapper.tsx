'use client';

import { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import LoadingSpinner from './LoadingSpinner';

export default function RootClientWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SessionProvider>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </Suspense>
  );
} 