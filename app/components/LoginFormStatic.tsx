'use client';

import { Suspense } from 'react';
import LoginFormClient from './LoginFormClient';
import LoadingSpinner from './LoadingSpinner';

export default function LoginFormStatic() {
  return (
    <div className="w-full max-w-md">
      <Suspense fallback={<LoadingSpinner />}>
        <LoginFormClient />
      </Suspense>
    </div>
  );
} 