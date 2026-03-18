const CACHE_NAME = 'smart-home-v13.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

self.addEventListener('push', (event) => {
    const options = {
        body: '🚨 Mouvement détecté !',
        icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        vibrate: [500, 100, 500],
        tag: 'alert'
    };
    event.waitUntil(self.registration.showNotification('SMART HOME', options));
});
