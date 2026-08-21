// ============ KB Agency — testimonials.js ============
// Переезд компонента "Design Testimonial" (21st.dev) на ванильный HTML/CSS/JS.
//
// ЗАГЛУШКА: тексты ниже — плейсхолдеры для превью вёрстки, это НЕ реальные
// цитаты клиентов. Заменить на настоящие отзывы (текст или пересказ голосового)
// перед тем как выкатывать в прод.
const TESTIMONIALS = [
  {
    quote: 'Здесь будет реальный отзыв клиента — коротко и по делу, без воды.',
    company: 'Название проекта',
    name: 'Имя Фамилия',
    role: 'Должность, компания',
  },
  {
    quote: 'Второй отзыв — просто пример того, как выглядит вёрстка с другим текстом.',
    company: 'Название проекта',
    name: 'Имя Фамилия',
    role: 'Должность, компания',
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('testimonials');
  if (!section) return;

  const numEl = document.getElementById('testimonialNum');
  const fillEl = document.getElementById('testimonialFill');
  const companyEl = document.getElementById('testimonialCompany');
  const quoteEl = document.getElementById('testimonialQuote');
  const nameEl = document.getElementById('testimonialName');
  const roleEl = document.getElementById('testimonialRole');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;

  const render = () => {
    const t = TESTIMONIALS[index];

    numEl.textContent = String(index + 1).padStart(2, '0');
    fillEl.style.height = `${((index + 1) / TESTIMONIALS.length) * 100}%`;
    companyEl.textContent = t.company;
    nameEl.textContent = t.name;
    roleEl.textContent = t.role;

    quoteEl.innerHTML = '';
    if (reducedMotion) {
      quoteEl.textContent = t.quote;
    } else {
      t.quote.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'testimonial__word';
        span.textContent = word;
        span.style.transitionDelay = `${i * 45}ms`;
        quoteEl.appendChild(span);
        quoteEl.appendChild(document.createTextNode(' '));
      });
      // force reflow so the transition actually plays from the initial state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          quoteEl.querySelectorAll('.testimonial__word').forEach(w => w.classList.add('is-in'));
        });
      });
    }
  };

  const goTo = (next) => {
    index = (next + TESTIMONIALS.length) % TESTIMONIALS.length;
    render();
  };

  const restartTimer = () => {
    if (reducedMotion || TESTIMONIALS.length < 2) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 6000);
  };

  prevBtn.addEventListener('click', () => { goTo(index - 1); restartTimer(); });
  nextBtn.addEventListener('click', () => { goTo(index + 1); restartTimer(); });

  if (TESTIMONIALS.length < 2) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  render();
  restartTimer();
});
