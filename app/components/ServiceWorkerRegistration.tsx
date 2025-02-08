'use client';

import { useEffect, useCallback } from 'react';

export default function ServiceWorkerRegistration() {
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }

      // Send initial cache assets
      registration.active?.postMessage({
        type: 'CACHE_ASSETS',
        payload: [
          '/',
          '/manifest.json',
          '/favicon.ico',
          // Add other assets to cache
        ]
      });

    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }, []);

  useEffect(() => {
    registerServiceWorker();

    return () => {
      // Cleanup if needed
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    };
  }, [registerServiceWorker]);

  return null;
} 