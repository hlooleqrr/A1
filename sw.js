const CACHE_NAME = 'fino-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/fino_advanced_features.css',
  '/fino_advanced_features.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
