/* neuralbroker — shared footer script: year, theme toggle, one quiet easter egg.
   Loaded with `defer` on every page. The theme *init* stays inline in <head>
   to avoid a flash of the wrong theme. */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

document.getElementById('theme-toggle')?.addEventListener('click', function () {
  var el = document.documentElement;
  var t = el.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  el.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch (e) {}
});

/* Mobile nav (checkbox-driven, works without JS): close on Escape or link tap. */
(function () {
  var navCheck = document.getElementById('nav-toggle');
  if (!navCheck) return;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navCheck.checked) navCheck.checked = false;
  });
  var links = document.querySelectorAll('.site-nav a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () { navCheck.checked = false; });
  }
})();

try {
  console.log(
    '%c$ sudo rm -rf /regrets\n%cpermission denied.\n\ngood.',
    'color:#A7D46F;font-family:monospace',
    'color:#858B84;font-family:monospace'
  );
} catch (e) {}
