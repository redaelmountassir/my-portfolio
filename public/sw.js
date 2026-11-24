self.addEventListener('install', () => {
  // Force this new service worker to bypass the waiting state
  // and immediately replace the old Gatsby service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Delete all old caches created by Workbox / gatsby-plugin-offline
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // 2. Unregister this service worker so it never runs again
      await self.registration.unregister();

      // 3. Force all open tabs of the site to reload from the network (your Vite app)
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});