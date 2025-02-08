'use client';

import { useEffect } from 'react';
import LoginFormRoot from './LoginFormRoot';

export default function ClientEntry() {
  useEffect(() => {
    // This ensures we're fully client-side
    const root = document.getElementById('login-form-root');
    if (root) {
      root.innerHTML = '';
    }
  }, []);

  return <LoginFormRoot />;
} 