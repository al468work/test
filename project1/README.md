# web — статическая админ-панель (SPA)

Веб-интерфейс проекта 08-2026 на **AdminLTE 4 / Bootstrap 5**.
Размещается на выделенном сервере (статический хостинг), **в прошивку ESP32
не входит** и в образ littlefs `master/data` не попадает.

Работает на **демо-данных** из `data/*.json`. Подключение к API/данным master
пока не реализовано.

## Структура

```
web/
├── index.html          оболочка SPA: меню, hash-роутинг, загрузка вьюх
├── manifest.json       PWA-манифест
├── sw.js               Service Worker (офлайн, версия кэша admin-ui-v4)
├── css/
│   ├── adminlte*.css   AdminLTE 4 (шаблон)
│   └── app.css         собственные стили (сетка, легенда, графики)
├── js/
│   ├── bootstrap.bundle.min.js
│   ├── adminlte.min.js
│   └── data-source.js  доступ к данным (сейчас JSON, задел под REST)
├── data/               демо-данные
│   ├── rtc.json        { Rtc: {...} }
│   ├── week.json       { Week: { "1".."7": { "0".."23": {...} } } }
│   ├── channels.json   { Channels: { "1".."16": {...} } }
│   ├── ina.json        { Ina: {...}, InaHistory: { hours: [...] } }
│   └── users.json      пример для шаблона views/tables.html
├── views/              фрагменты страниц (загружаются в #main-content)
│   ├── dashboard.html  обзор
│   ├── week.html       сетка расписания 7×24
│   ├── channels.html   реестр каналов
│   ├── ina.html        показания и графики INA3221
│   ├── rtc.html        часы (демо)
│   ├── settings.html   настройки/служебное
│   └── tables.html     шаблон таблицы (пример)
├── pages/              демо-страницы AdminLTE (шаблоны, не используются)
├── assets/img/         картинки AdminLTE (шаблоны)
├── index2.html         демо-дашборд AdminLTE (шаблон)
├── index3.html         демо-дашборд AdminLTE (шаблон)
├── starter.html        пустая страница AdminLTE (шаблон)
├── users.html          демо-пользователи AdminLTE (шаблон)
└── tables.html         простая статическая таблица (шаблон)
```

## Маршруты (hash)

| Hash | Вьюха | Назначение |
|---|---|---|
| `#dashboard` (по умолчанию) | `views/dashboard.html` | время, текущее задание, INA, счётчики |
| `#week` | `views/week.html` | недельная сетка 7×24, подсветка текущего часа |
| `#channels` | `views/channels.html` | 16 каналов: имя, MAC, клапан, статус |
| `#ina` | `views/ina.html` | V/I/P по 3 каналам + история 24 ч |
| `#rtc` | `views/rtc.html` | часы, дата, день недели |
| `#settings` | `views/settings.html` | тема, источник данных, сброс кэша |

## Источник данных

`js/data-source.js` — единственная точка доступа:

- `DataSource.getRtc()`, `getWeek()`, `getChannels()`, `getIna()`;
- хелперы `formatTime`, `formatDate`, `dayName`, `channelColor`,
  `currentTask`, `escapeHtml`.

Сейчас методы читают `data/*.json`. Чтобы перейти на REST API master, достаточно
заменить тела этих методов на `fetch(<URL>)` с той же структурой ответа —
вьюхи менять не нужно.

Форматы данных повторяют контракты прошивки master (`Week`, `Channels`, `Rtc`,
`Ina`); подробности — `master/IMPLEMENTED.md` и `share/IMPLEMENTED.md`.

## Локальный запуск

Из каталога `web/` (нужен любой статический сервер, т.к. `fetch` не работает
по `file://`):

```
python -m http.server 8000
```

Затем открыть `http://localhost:8000/`.

## Офлайн/PWA

- `sw.js` кэширует интерфейс и данные; стратегия — сеть в приоритете, кэш как
  запасной вариант.
- При изменении набора файлов поднимайте `CACHE_NAME` в `sw.js`.
- Сбросить кэш и Service Worker можно в разделе «Настройки».

## Шаблоны

`index2.html`, `index3.html`, `starter.html`, `users.html`, `tables.html`,
`pages/*`, `assets/*`, карты `.map`, немайненные `css/js` оставлены как
шаблоны для дальнейшей разработки — в рабочем интерфейсе не используются.
