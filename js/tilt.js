// ============ KB Agency — tilt.js ============
// 3D-наклон карточек + magnetic-эффект кнопок. Только для fine-pointer устройств без reduced-motion.

document.addEventListener('DOMContentLoaded', () => {

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reducedMotion) return;

  /* ---------- 3D tilt on cards ---------- */
  const tiltEls = document.querySelectorAll('.card, .service, .case-card, .service-block');
  const MAX_TILT = 7; // degrees

  tiltEls.forEach(el => {
    let raf = null;

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);

      const rotY = (px - 0.5) * MAX_TILT * 2;
      const rotX = (0.5 - py) * MAX_TILT * 2;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
    });

    el.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });

  /* ---------- magnetic buttons ---------- */
  const magnetic = document.querySelectorAll('.btn:not(.header__cta)');
  const RADIUS = 60;
  const STRENGTH = 0.35;

  magnetic.forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS + rect.width / 2) {
        btn.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH - 3}px)`;
      }
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

});
