const CACHE_NAME = 'smart-home-v12.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'
];

// 1. INSTALLATION : Met en cache et force la mise à jour immédiate
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS))
  );
});

// 2. ACTIVATION : Nettoie les vieux fichiers des versions précédentes (V11, V10...)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  return self.clients.claim(); 
});

// 3. FETCH : Stratégie "Cache First" (Indispensable pour l'installation sur Android)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

// 4. PUSH : REÇOIT LES ALERTES (C'est ce qui manquait !)
// Permet d'afficher une notification même si l'écran est éteint
self.addEventListener('push', (event) => {
  const options = {
    body: '🚨 Alerte : Mouvement détecté dans la maison !',
    icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
    vibrate: [500, 100, 500],
    tag: 'alert-intrusion',
    renotify: true
  };
  event.waitUntil(
    self.registration.showNotification('SMART HOME IUT', options)
  );
});

// 5. CLIC NOTIFICATION : Ouvre l'application quand on clique sur l'alerte
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./index.html')
  );
});
