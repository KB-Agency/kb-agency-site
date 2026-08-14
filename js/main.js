// ============ KB Agency — main.js ============

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- burger menu ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  // `overflow:hidden` on <body> alone doesn't reliably stop background
  // scroll on mobile Safari/Chrome when the page is already scrolled down —
  // the fixed full-screen menu ends up rendered against a shifted page
  // behind it. Locking body to `position:fixed` at the current scroll
  // offset (and restoring it on close) is the robust cross-browser fix.
  let lockedScrollY = 0;
  const lockScroll = () => {
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
  };
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, lockedScrollY);
  };

  const setMenuOpen = (open) => {
    nav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    if (open) lockScroll(); else unlockScroll();
  };

  burger.addEventListener('click', () => {
    setMenuOpen(!nav.classList.contains('is-open'));
  });
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.style.transitionDelay) || 0;
        el.classList.add('is-visible');
        // clear the stagger delay once the reveal transition itself is done,
        // so it doesn't linger and block fast hover/tilt transitions afterwards
        setTimeout(() => { el.style.transitionDelay = ''; }, delay + 800);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
    revealObserver.observe(el);
  });

  /* ---------- animated stat counters ---------- */
  const stats = document.querySelectorAll('.stat__value[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(el => statObserver.observe(el));

  /* ---------- cursor glow ---------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX - 110}px, ${e.clientY - 110}px)`;
    }, { passive: true });

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  /* ---------- cookie banner ---------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');
  const cookieSettingsLink = document.getElementById('cookieSettingsLink');
  const COOKIE_KEY = 'kb_cookie_consent';

  const showCookieBanner = () => cookieBanner.classList.add('is-visible');
  const hideCookieBanner = () => cookieBanner.classList.remove('is-visible');

  if (!localStorage.getItem(COOKIE_KEY)) {
    setTimeout(showCookieBanner, 1200);
  }
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    hideCookieBanner();
  });
  cookieDecline.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    hideCookieBanner();
  });
  cookieSettingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showCookieBanner();
  });

  /* ---------- contact form → /api/submit-lead (forwards to Telegram) ---------- */
  const ctaForm = document.getElementById('ctaForm');
  const ctaNote = document.getElementById('ctaNote');
  if (ctaForm) {
    ctaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const servicesField = ctaForm.querySelector('#ctaServices');
      const services = servicesField ? servicesField.value : '';
      const submitBtn = ctaForm.querySelector('button[type="submit"]');

      const payload = {
        name: ctaForm.querySelector('input[name="name"]').value,
        phone: ctaForm.querySelector('input[name="phone"]').value,
        services,
      };

      submitBtn.disabled = true;
      ctaNote.textContent = 'Отправляем…';

      try {
        const res = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('request failed');

        ctaNote.textContent = services
          ? `Спасибо! Заявка с пакетом «${services}» принята — свяжемся в ближайшее время.`
          : 'Спасибо! Мы свяжемся с вами в ближайшее время.';
        ctaForm.reset();
        document.querySelectorAll('.calc__checkbox:checked').forEach(cb => {
          cb.checked = false;
          cb.dispatchEvent(new Event('change'));
        });
      } catch (err) {
        ctaNote.textContent = `Не удалось отправить заявку. Напишите нам напрямую в Telegram: @KB_AGENCY.`;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

});
