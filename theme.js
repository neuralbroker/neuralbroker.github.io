(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var root = document.documentElement;

  function getTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    var next = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    updateMeta(next);
    updateToggle(next);
  }

  function updateMeta(theme) {
    var meta = document.getElementById('theme-color-meta');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#0a0a0a');
  }

  function updateToggle(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = theme !== 'light';
    btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function initToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    updateToggle(getTheme());
    btn.addEventListener('click', function () {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function normalizePath(path) {
    if (!path || path === '/') return '/';
    return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  }

  function initNavCurrent() {
    var links = document.querySelectorAll('.nav-list a[data-nav]');
    if (!links.length) return;

    var current = normalizePath(location.pathname);
    var page = current.split('/').pop() || 'home';

    if (current === '/' || current.endsWith('/neuralbroker.github.io')) page = 'home';
    if (location.pathname.indexOf('/writing/') !== -1) page = 'writing';
    if (location.pathname.indexOf('/projects/') !== -1) page = 'projects';

    links.forEach(function (link) {
      var nav = link.getAttribute('data-nav');
      var active = nav === page;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  initToggle();
  initYear();
  initNavCurrent();
})();