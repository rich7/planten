// Kweekkompas Service Worker v6
const CACHE = 'kweekkompas-v6';
const ASSETS = [
  '/planten/',
  '/planten/index.html',
  '/planten/manifest.json',
  '/planten/icon-192.png',
  '/planten/icon-512.png',
  '/planten/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  // Google Sheets data: altijd netwerk, geen cache
  if (e.request.url.includes('docs.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/planten/')))
  );
});
