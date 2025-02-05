'use client';

import { useEffect, useState } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width = 200, height = 80 }: LogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} />;
  }

  return (
    <div style={{ width, height }} className="relative">
      <img
        src="/logo.png"
        alt="Key Inventory System"
        className="w-full h-full object-contain"
      />
    </div>
  );
} 