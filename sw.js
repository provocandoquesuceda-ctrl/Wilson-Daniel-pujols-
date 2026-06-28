const CACHE_NAME = 'wilson-pujols-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/todo.html',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Cache abierto');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('⚠️ Error al cachear archivos:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
  // Solo GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Retornar del cache si existe
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        // No cachear si no es un HTTP GET válido
        if (!response || response.status !== 200 || !event.request.url.startsWith('http')) {
          return response;
        }

        // Clonar la respuesta
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Retornar página offline si falla
        return caches.match('/index.html');
      });
    })
  );
});
