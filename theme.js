(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var root = document.documentElement;

  root.classList.add('js');

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
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
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

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    function show(el) {
      el.classList.add('is-visible');
    }

    els.forEach(function (el) {
      if (isInViewport(el)) show(el);
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(show);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' }
    );

    els.forEach(function (el) {
      if (!el.classList.contains('is-visible')) observer.observe(el);
    });
  }

  initToggle();
  initYear();
  initReveal();
})();