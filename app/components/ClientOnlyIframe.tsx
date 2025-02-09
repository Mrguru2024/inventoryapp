'use client';

import { useEffect, useState } from 'react';

export default function ClientOnlyIframe({ src, ...props }: { src: string; [key: string]: any }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <iframe src={src} {...props} />;
} 