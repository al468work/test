const CACHE_NAME = 'admin-ui-v3';
const API_CACHE_NAME = 'admin-api-data-v1';

// Файлы интерфейса, которые должны работать 100% автономно
const UI_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/adminlte.min.css',
  './js/bootstrap.bundle.min.js',
  './js/adminlte.min.js',
  './views/dashboard.html',
  './views/tables.html',
  './views/settings.html'
];

// 1. Установка: сохраняем весь интерфейс в память телефона
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        UI_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('Пропущен файл при кэшировании:', url))
        )
      );
    })
  );
  self.skipWaiting();
});

// 2. Активация: удаляем устаревшие версии кэша интерфейса
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Обработка всех запросов
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // А. Если запрос идет к файлам нашего интерфейса (тот же домен GitHub Pages)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        // Если файл есть в кэше — отдаем его МГНОВЕННО (работает в авиарежиме)
        if (cachedResponse) {
          return cachedResponse;
        }
        // Если файла еще нет в кэше — качаем из сети и сохраняем
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Б. Если запрос идет на внешний REST API (другой домен)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Сохраняем свежий ответ API в отдельный кэш на случай потери связи
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(async () => {
        // Если интернета нет — отдаем последние сохраненные данные от API
        const cachedApi = await caches.match(event.request);
        if (cachedApi) {
          return cachedApi;
        }
        return new Response(JSON.stringify({ error: 'Offline: нет сохраненных данных' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
  );
});
