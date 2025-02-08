'use client';

import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';

export default function LoginFormContainer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return <LoginForm />;
} 