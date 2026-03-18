// Nom du cache pour la version de ton app
const CACHE_NAME = 'smart-home-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'
];

// 1. Installation : On met en cache les fichiers importants
self.addEventListener('install', (i) => {
  i.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activation : On nettoie les vieux caches si besoin
self.addEventListener('activate', (a) => {
  console.log('Service Worker activé !');
});

// 3. Stratégie réseau : On sert le cache si on est hors-ligne
self.addEventListener('fetch', (f) => {
  f.respondWith(
    caches.match(f.request).then((response) => {
      return response || fetch(f.request);
    })
  );
});

// 4. Gestion des Notifications Push (C'est ça qui fait vibrer le tel)
self.addEventListener('push', function(event) {
    const options = {
        body: '🚨 Mouvement détecté dans la maison !',
        icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        vibrate: [500, 100, 500],
        data: { url: './' }
    };
    event.waitUntil(
        self.registration.showNotification('ALERTE INTRUSION', options)
    );
});

// 5. Clic sur la notification : On ouvre l'appli
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
