(function() {
  var html = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  var stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    html.setAttribute('data-theme', stored);
  }

  function isDark() {
    var current = html.getAttribute('data-theme');
    if (current === 'dark') return true;
    if (current === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function syncToggleState() {
    toggle.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
    toggle.setAttribute('title', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function toggleTheme() {
    var next = isDark() ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncToggleState();
  }

  syncToggleState();
  toggle.addEventListener('click', toggleTheme);
  toggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
})();
