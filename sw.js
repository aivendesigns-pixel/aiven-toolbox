const CACHE_NAME = 'toolbox-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/toolbox.png',
  './icons/cyberfortunegod.png',
  './icons/postagent.png',
  './icons/soloceo.png',
  './icons/justdoit.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
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
