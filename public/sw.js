
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Remove old cached site files
    const keys = await caches.keys();
    await Promise.all(
      keys.map(key => caches.delete(key))
    );

    // Find open tabs
    const windows = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    // Remove this service worker
    await self.registration.unregister();

    // Reload open tabs
    await Promise.all(
      windows.map(client => client.navigate(client.url))
    );
  })());
});
