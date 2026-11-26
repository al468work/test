<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Админ-панель | AdminLTE 4</title>
    
    <!-- Настройки PWA для Android -->
    <link rel="manifest" href="manifest.json" />
    <meta name="theme-color" content="#343a40" />
    <link rel="apple-touch-icon" href="icon-512.png" />

    <!-- Локальные стили AdminLTE -->
    <link rel="stylesheet" href="css/adminlte.min.css" />
  </head>
  <body class="layout-fixed sidebar-expand-lg bg-body-tertiary">
    <div class="app-wrapper">
      <!-- Верхняя шапка -->
      <nav class="app-header navbar navbar-expand bg-body">
        <div class="container-fluid">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" data-lte-toggle="sidebar" href="#" role="button">☰</a>
            </li>
            <li class="nav-item d-none d-md-block">
              <span class="nav-link text-muted">Панель управления</span>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Боковое меню -->
      <aside class="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
        <div class="sidebar-brand">
          <a href="#dashboard" class="brand-link">
            <span class="brand-text fw-light">Моя Админка</span>
          </a>
        </div>
        <div class="sidebar-wrapper">
          <nav class="mt-2">
            <ul class="nav sidebar-menu flex-column" role="menu">
              <li class="nav-item">
                <a href="#dashboard" class="nav-link">
                  <p>Дашборд</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#tables" class="nav-link">
                  <p>Таблицы</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#settings" class="nav-link">
                  <p>Настройки</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Центральная часть (сюда подгружаются вьюхи) -->
      <main class="app-main" id="main-content">
        <div class="p-4 text-muted">Загрузка раздела...</div>
      </main>

      <!-- Подвал -->
      <footer class="app-footer">
        <strong>AdminLTE 4</strong> на GitHub Pages.
      </footer>
    </div>

    <!-- Локальные скрипты Bootstrap и AdminLTE -->
    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/adminlte.min.js"></script>

    <!-- Скрипт роутинга и запуска JS внутри подгружаемых страниц -->
    <script>
      const mainContent = document.getElementById('main-content');
      const menuLinks = document.querySelectorAll('.sidebar-menu .nav-link');

      // Принудительный запуск тегов <script> внутри загруженного HTML
      function executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }

      // Загрузка HTML-фрагмента и подсветка активного пункта меню
      async function loadView(viewName) {
        const page = viewName || 'dashboard';

        menuLinks.forEach(link => {
          const linkHash = link.getAttribute('href').replace('#', '');
          link.classList.toggle('active', linkHash === page);
        });

        try {
          const response = await fetch(`views/${page}.html?t=${Date.now()}`);
          if (!response.ok) throw new Error(`Файл views/${page}.html не найден (${response.status})`);
          
          mainContent.innerHTML = await response.text();
          executeScripts(mainContent);
        } catch (error) {
          mainContent.innerHTML = `<div class="p-4 text-danger">Ошибка: ${error.message}</div>`;
        }
      }

      function getCurrentRoute() {
        return window.location.hash.replace('#', '');
      }

      window.addEventListener('hashchange', () => loadView(getCurrentRoute()));
      window.addEventListener('DOMContentLoaded', () => loadView(getCurrentRoute()));
    </script>

    <!-- Регистрация Service Worker для автономной работы (офлайн) -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Офлайн-режим (Service Worker) активирован'))
            .catch(err => console.error('Ошибка Service Worker:', err));
        });
      }
    </script>
  </body>
</html>
