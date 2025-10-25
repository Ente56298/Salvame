// Service Worker for offline support
const CACHE_NAME = 'asistencia-vial-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/rocket-theme.css',
  '/src/index.css',
  '/src/data/talleres.json',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle emergency notifications
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'EMERGENCY_ALERT') {
    self.registration.showNotification('🚨 Emergencia Activada', {
      body: 'Servicios de emergencia han sido contactados',
      icon: '/manifest.json',
      badge: '/manifest.json',
      tag: 'emergency',
      requireInteraction: true,
      actions: [
        {
          action: 'call-911',
          title: 'Llamar 911'
        },
        {
          action: 'cancel',
          title: 'Cancelar'
        }
      ]
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'call-911') {
    clients.openWindow('tel:911');
  } else if (event.action === 'cancel') {
    // Just close the notification
  } else {
    // Default action - open the app
    clients.openWindow('/');
  }
});