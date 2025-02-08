'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';

export default function LoginFormRoot() {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('login-form-root'));
    setMounted(true);
  }, []);

  if (!mounted || !container) {
    return <LoadingSpinner />;
  }

  return createPortal(
    <LoginForm />,
    container
  );
} 