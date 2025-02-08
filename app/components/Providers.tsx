'use client';

import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import LoadingSpinner from './LoadingSpinner';

export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Handle touch events with passive option
  useEffect(() => {
    const options = { passive: true };
    
    // Add passive touch event listeners
    document.addEventListener('touchstart', () => {}, options);
    document.addEventListener('touchmove', () => {}, options);

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', () => {});
      document.removeEventListener('touchmove', () => {});
    };
  }, []);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <LoadingSpinner />;
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