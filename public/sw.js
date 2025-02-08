// Immediately add event listeners during initialization
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.resolve()
      .then(() => {
        console.log('Service Worker installing...');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.resolve()
      .then(() => {
        console.log('Service Worker activating...');
        return self.clients.claim();
      })
  );
});

// Message handler must be registered immediately
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'CACHE_ASSETS':
      event.waitUntil(
        caches.open('app-cache').then((cache) => {
          return cache.addAll(payload);
        })
      );
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
}); 