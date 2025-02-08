'use client';

import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';

export default function LoginFormClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LoginForm />
      </ThemeProvider>
    </SessionProvider>
  );
} 