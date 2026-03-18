const CACHE_NAME = 'smart-home-v11';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'
];

// 1. Installation : Met en cache les fichiers pour l'accès hors-ligne
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS))
  );
});

// 2. Activation : Nettoie les anciennes versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
  );
});

// 3. Interception des requêtes
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

// 4. RÉCEPTION DES NOTIFICATIONS (La partie que tu demandais)
self.addEventListener('push', (event) => {
    const options = {
        body: '🚨 Alerte : Mouvement détecté dans la maison !',
        icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        vibrate: [500, 100, 500],
        tag: 'intrusion-alert',
        renotify: true,
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification('ALERTE SMART HOME', options)
    );
});

// 5. Clic sur la notification (Ouvre l'appli)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('./index.html'));
});
