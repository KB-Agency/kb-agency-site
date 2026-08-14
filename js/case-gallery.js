// ============ KB Agency — case-gallery.js ============
// Клик по миниатюре меняет большое фото кейса прямо на странице (без модалки).
// Работает независимо для каждого блока .case-study — можно иметь несколько кейсов на странице.

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.case-study').forEach((section) => {
    const thumbs = section.querySelectorAll('.case-study__thumb');
    const image = section.querySelector('.case-study__image');
    const tag = section.querySelector('.case-study__tag');
    const desc = section.querySelector('.case-study__desc');
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
  });

});
