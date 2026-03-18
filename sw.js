const CACHE_NAME = 'smart-home-v6';
const ASSETS = ['./', './index.html', './manifest.json'];

// Installation et mise en cache
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

// Nettoyage ancien cache
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
});

// Réception de l'ordre de notification
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || '🚨 Alerte : Mouvement détecté !',
        icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        vibrate: [500, 100, 500],
        data: { url: './' },
        actions: [{ action: 'open', title: 'Voir la maison' }]
    };
    event.waitUntil(self.registration.showNotification(data.title || 'ALERTE MAISON', options));
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('./'));
});
