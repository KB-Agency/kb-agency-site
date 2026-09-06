// ============ KB Agency — case-gallery.js ============
// Клик по миниатюре меняет большое фото кейса прямо на странице (без модалки).
// Работает независимо для каждого блока .case-study — можно иметь несколько кейсов на странице.

document.addEventListener('DOMContentLoaded', () => {

  // ---------- fullscreen lightbox (shared across all .case-study sections) ----------
  const lightbox = document.getElementById('caseLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeThumbs = [];
  let activeIndex = -1;

  function renderLightbox(thumb){
    if (!lightbox || !lightboxImage || !thumb) return;
    lightboxImage.src = thumb.dataset.img;
    lightboxImage.alt = thumb.dataset.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = thumb.dataset.tag || '';
  }

  function openLightbox(thumbs, index){
    if (!lightbox) return;
    activeThumbs = thumbs;
    activeIndex = index;
    renderLightbox(thumbs[index]);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function navigateLightbox(step){
    if (!activeThumbs.length) return;
    activeIndex = (activeIndex + step + activeThumbs.length) % activeThumbs.length;
    const thumb = activeThumbs[activeIndex];
    thumb.click();
    renderLightbox(thumb);
  }

  if (lightbox){
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  document.querySelectorAll('.case-study').forEach((section) => {
    const thumbs = [...section.querySelectorAll('.case-study__thumb')];
    const image = section.querySelector('.case-study__image');
    const tag = section.querySelector('.case-study__tag');
    const desc = section.querySelector('.case-study__desc');
    const expandBtn = section.querySelector('.case-study__expand');
    if (!thumbs.length || !image) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        if (thumb.classList.contains('is-active')) return;

        thumbs.forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');

        image.classList.add('is-swapping');
        setTimeout(() => {
          image.src = thumb.dataset.img;
          image.alt = thumb.dataset.alt || '';
          if (tag) tag.textContent = thumb.dataset.tag || '';
          if (desc) desc.textContent = thumb.dataset.desc || '';
          image.classList.remove('is-swapping');
        }, 180);
      });
    });

    const openCurrent = () => {
      const activeIdx = thumbs.findIndex((t) => t.classList.contains('is-active'));
      openLightbox(thumbs, activeIdx === -1 ? 0 : activeIdx);
    };
    image.addEventListener('click', openCurrent);
    if (expandBtn) expandBtn.addEventListener('click', openCurrent);
  });

});
