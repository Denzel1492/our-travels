// Очищенный воркер для принудительного обновления всех файлов сайта
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('fetch', event => event.respondWith(fetch(event.request)));
