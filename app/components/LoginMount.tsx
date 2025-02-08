'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import LoginFormWrapper from './LoginFormWrapper';

export default function LoginMount() {
  useEffect(() => {
    const container = document.getElementById('login-mount-point');
    if (container) {
      const root = createRoot(container);
      root.render(<LoginFormWrapper />);
    }
  }, []);

  return null;
} 