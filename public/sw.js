// Спершу мережа (щоб новини були свіжими), без звʼязку — остання збережена копія
const CACHE = 'berlin-v9';
const SHELL = ['./', 'feed.js', 'sources.json', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))));
});
self.addEventListener('activate', e => {
  // кеш спільний для всіх сайтів на github.io, тому чистимо лише свій
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('berlin-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const key = url.origin + url.pathname; // без ?t=
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(e.request);
      if (res.ok) e.waitUntil(cache.put(key, res.clone()));
      return res;
    } catch (err) {
      const hit = await cache.match(key);
      if (hit) return hit;
      throw err;
    }
  })());
});
