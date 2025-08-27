const CACHE_NAME = 'cyber-game-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/background.png',
  './img/player.png',
  './img/bullet.png',
  './img/virus1.png',
  './img/virus2.png',
  './img/virus3.png',
  './img/boss.png',
  './img/icon-192.png',
  './img/icon-512.png'
];

// Instalação do service worker e cache dos arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Ativar o service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Interceptar requisições e responder com cache ou fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Aqui você pode retornar uma página offline ou placeholder se desejar
      })
  );
});
