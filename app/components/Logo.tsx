'use client';

import { useEffect, useState } from 'react';

export function Logo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[200px] h-[80px]" />;
  }

  return (
    <div className="w-[200px] h-[80px] relative">
      <img
        src="/logo.png"
        alt="Key Inventory System"
        className="w-full h-full object-contain"
      />
    </div>
  );
} 