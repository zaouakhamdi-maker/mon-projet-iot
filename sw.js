// Nom du cache pour permettre un chargement rapide
const CACHE_NAME = 'myhome-v1';

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installé');
});

// Gestion des requêtes (permet à l'app de s'ouvrir même avec un réseau faible)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
