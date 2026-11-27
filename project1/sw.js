const CACHE_NAME = 'admin-ui-v7';
const API_CACHE_NAME = 'admin-api-data-v1';

// Файлы интерфейса, которые должны работать автономно.
// При изменении набора — поднимать CACHE_NAME выше.
const UI_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/adminlte.min.css',
  './css/app.css',
  './js/bootstrap.bundle.min.js',
  './js/adminlte.min.js',
  './js/data-source.js',
  './views/dashboard.html',
  './views/week.html',
  './views/channels.html',
  './views/ina.html',
  './views/rtc.html',
  './views/settings.html',
  './data/rtc.json',
  './data/week.json',
  './data/channels.json',
  './data/ina.json'
];

// 1. Установка: сохраняем интерфейс в кэш.
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

// 2. Активация: удаляем устаревшие версии кэша интерфейса.
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

// 3. Обработка запросов: сеть в приоритете, кэш — запасной вариант.
//    Так при разработке сразу видно свежие файлы, а офлайн всё равно работает.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // А. Файлы нашего интерфейса (тот же origin).
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request, { ignoreSearch: true });
          if (cached) return cached;
          return new Response('Офлайн: файл не найден в кэше', { status: 503 });
        })
    );
    return;
  }

  // Б. Запросы к внешнему REST API (другой домен).
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedApi = await caches.match(event.request);
        if (cachedApi) return cachedApi;
        return new Response(JSON.stringify({ error: 'Offline: нет сохраненных данных' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
  );
});
