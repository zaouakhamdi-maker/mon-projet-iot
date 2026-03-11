self.addEventListener('install', (e) => {
  console.log('Service Worker: Installé');
});

self.addEventListener('fetch', (e) => {
  // Permet à l'application de fonctionner même avec une connexion instable
  e.respondWith(fetch(e.request));
});
