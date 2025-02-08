'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';

const LoginForm = dynamic(() => import('./LoginForm'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function LoginFormWrapper() {
  return <LoginForm />;
} 