// Change la version (v8) pour forcer ton téléphone à se mettre à jour
const CACHE_NAME = 'smart-home-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'
];

self.addEventListener('install', (i) => {
  i.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
});

self.addEventListener('fetch', (f) => {
  f.respondWith(caches.match(f.request).then((res) => res || fetch(f.request)));
});

self.addEventListener('push', (event) => {
    const options = {
        body: '🚨 Mouvement détecté dans la maison !',
        icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        vibrate: [500, 100, 500]
    };
    event.waitUntil(self.registration.showNotification('ALERTE INTRUSION', options));
});
