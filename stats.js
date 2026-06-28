(function () {
  'use strict';

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = String(value);
  }

  function fetchGitHub() {
    fetch('https://api.github.com/users/neuralbroker')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        setText('gh-repos', data.public_repos);
        setText('gh-followers', data.followers);
      })
      .catch(function () {});
  }

  function fetchRepo(name, starsId, updatedId) {
    fetch('https://api.github.com/repos/neuralbroker/' + name)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        setText(starsId, data.stargazers_count);
        if (updatedId && data.updated_at) {
          setText(updatedId, data.updated_at.slice(0, 10));
        }
      })
      .catch(function () {});
  }

  if (document.getElementById('gh-repos')) fetchGitHub();
  if (document.getElementById('bk-stars')) fetchRepo('blitzkode', 'bk-stars', 'bk-updated');
  if (document.getElementById('nd-stars')) fetchRepo('neudb', 'nd-stars', 'nd-updated');
})();