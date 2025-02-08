'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('../providers').then(mod => mod.Providers), {
  ssr: false,
  loading: () => <div>Loading providers...</div>
});

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading providers...</div>}>
      <Providers>{children}</Providers>
    </Suspense>
  );
} 