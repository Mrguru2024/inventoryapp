'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientInit({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    // Add passive event listeners
    const options = { passive: true };
    const noop = () => {};
    
    document.addEventListener('touchstart', noop, options);
    document.addEventListener('touchmove', noop, options);
    document.addEventListener('wheel', noop, options);

    return () => {
      document.removeEventListener('touchstart', noop);
      document.removeEventListener('touchmove', noop);
      document.removeEventListener('wheel', noop);
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return children;
} 