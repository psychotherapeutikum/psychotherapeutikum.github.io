var CACHE = 'visitenkarte-v3';
var DATEIEN = [
  './', './index.html', './manifest.webmanifest',
  './bilder/hinten.jpg',
  './bilder/vorne-1.jpg', './bilder/vorne-2.jpg', './bilder/vorne-3.jpg', './bilder/vorne-4.jpg',
  './bilder/vorne-5.jpg', './bilder/vorne-6.jpg', './bilder/vorne-7.jpg', './bilder/vorne-8.jpg',
  './icons/icon-32.png', './icons/icon-180.png', './icons/icon-192.png',
  './icons/icon-512.png', './icons/icon-maskable-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(DATEIEN); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (namen) {
      return Promise.all(namen.filter(function (n) { return n !== CACHE; })
        .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (antwort) {
      var kopie = antwort.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, kopie); });
      return antwort;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) {
        return r || caches.match('./index.html');
      });
    })
  );
});
