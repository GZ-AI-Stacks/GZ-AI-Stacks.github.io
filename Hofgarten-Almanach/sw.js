// Hofgarten-Almanach Service Worker
// Strategie: Network-First — bei aktiver Internet-/WLAN-Verbindung wird IMMER die
// aktuelle Version vom Server geladen (damit Änderungen sofort sichtbar sind).
// Der Cache dient nur als Offline-Fallback, wenn kein Netz verfügbar ist.

var CACHE_NAME = 'hofgarten-almanach-v1';
var CACHE_FILES = [
  './AmishSecrets.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        return cached || caches.match('./AmishSecrets.html');
      });
    })
  );
});
