const CACHE_NAME = 'admin-pwa-v1';

// Список всех файлов, которые нужно сохранить в память телефона
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './css/adminlte.min.css',
  './js/bootstrap.bundle.min.js',
  './js/adminlte.min.js',
  './views/dashboard.html',
  './views/tables.html',
  './views/settings.html',
  './data/users.json'
];

// Установка: скачиваем и кэшируем все файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация: удаляем старый кэш при обновлении версии CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов: сначала пытаемся загрузить свежее из сети, если сети нет — берем из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Если сеть есть — обновляем файл в кэше на будущее
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => {
        // Если интернета нет — отдаем сохраненную копию (игнорируя параметр ?t=...)
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
