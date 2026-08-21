const CACHE = 'zeitkompass-mitarbeiter-v1';
const FILES = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: waehrend der Entwicklung immer die aktuelle Version laden,
// nur bei fehlendem Netz auf den zuletzt funktionierenden Stand zurueckfallen.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      var copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
  );
});
