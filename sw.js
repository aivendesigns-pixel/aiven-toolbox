const CACHE_NAME = 'toolbox-v12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/toolbox.png',
  './icons/toolbox-192.png',
  './icons/toolbox-512.png',
  './icons/cyberfortunegod.png',
  './icons/postagent.png',
  './icons/soloceo.png',
  './icons/justdoit.png',
  './icons/rbgtracker.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Bypass browser/CDN cache to get fresh files
      return Promise.all(
        ASSETS.map(function(url) {
          return fetch(url, { cache: 'no-cache' }).then(function(resp) {
            return cache.put(url, resp);
          });
        })
      );
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', function(e) {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function(e) {
  // Don't cache iframe app requests (cross-origin)
  if (e.request.url.includes('vercel.app') || e.request.url.includes('github.io/solo-ceo')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});
