'use client';

import { useEffect, useState, useCallback } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setupTouchListeners = useCallback(() => {
    try {
      const options = { passive: true };
      document.addEventListener('touchstart', () => {}, options);
      document.addEventListener('touchmove', () => {}, options);
    } catch (err) {
      console.error('Error setting up touch listeners:', err);
    }
  }, []);

  useEffect(() => {
    try {
      setMounted(true);
      setupTouchListeners();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [setupTouchListeners]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error initializing app: {error.message}
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
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
  );
} 