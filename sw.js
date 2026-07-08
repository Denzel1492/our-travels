const CACHE_NAME = 'travel-cache-v1';
const ASSETS = ['index.html', 'styles.css', 'app.js', 'manifest.json', 'icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
