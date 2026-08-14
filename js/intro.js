// ============ KB Agency — intro.js ============
// Брендованный intro-экран: один раз за сессию, пропуск по клику, уважает reduced-motion.

document.addEventListener('DOMContentLoaded', () => {

  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  const KEY = 'kb_intro_seen';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen = sessionStorage.getItem(KEY);

  if (alreadySeen || reduced) {
    overlay.classList.add('is-hidden');
    return;
  }

  sessionStorage.setItem(KEY, '1');

  let dismissed = false;
  let autoTimer;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('is-hidden');
    overlay.removeEventListener('click', dismiss);
    clearTimeout(autoTimer);
  }

  requestAnimationFrame(() => {
    overlay.classList.add('is-drawn');
  });

  autoTimer = setTimeout(dismiss, 1900);
  overlay.addEventListener('click', dismiss);
});
