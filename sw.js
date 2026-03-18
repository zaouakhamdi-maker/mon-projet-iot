const CACHE_NAME = 'smart-home-v10'; // On passe en V10 pour forcer la mise à jour
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js'
];

// 1. INSTALLATION : Mise en cache des fichiers pour le mode PWA (installation)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => {
      console.log("Service Worker: Mise en cache des fichiers");
      return c.addAll(ASSETS);
    })
  );
});

// 2. ACTIVATION : Supprime les anciens caches pour éviter les bugs d'affichage
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            console.log("Service Worker: Suppression ancien cache", k);
            return caches.delete(k);
          }
        })
      );
    })
  );
});

// 3. FETCH : Permet à l'application de fonctionner même avec une connexion instable
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

// 4. PUSH : Affiche la notification quand le serveur (ou Firebase) envoie une alerte
self.addEventListener('push', (event) => {
    let data = { title: 'ALERTE MAISON', body: 'Mouvement détecté !' };
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/553/553376.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/553/553376.png', // Petite icône dans la barre d'état
        vibrate: [500, 100, 500],
        data: { url: './' }, // Page à ouvrir au clic
        tag: 'intrusion-alert', // Empêche d'empiler 50 notifications
        renotify: true // Fait vibrer même si une notif est déjà là
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 5. CLIC SUR NOTIFICATION : Ouvre l'application quand on appuie sur l'alerte
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Si l'app est déjà ouverte, on va dessus
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sinon on l'ouvre
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
