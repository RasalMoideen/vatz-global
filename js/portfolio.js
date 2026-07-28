/**
 * VATZ - Portfolio Page
 * Filter, Masonry & Lightbox
 */

'use strict';

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
const initPortfolioFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.masonry-item');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        const cat = item.dataset.category;
        const match = filter === 'all' || cat === filter;

        if (match) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = '';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
};

/* ============================================
   LIGHTBOX
   ============================================ */
const initLightbox = () => {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const closeBtn    = document.querySelector('.lightbox-close');
  const prevBtn     = document.querySelector('.lightbox-prev');
  const nextBtn     = document.querySelector('.lightbox-next');
  const items       = document.querySelectorAll('.masonry-item[data-lightbox]');

  if (!lightbox || !items.length) return;

  let currentIndex = 0;
  let visibleItems = [];

  const getVisible = () => Array.from(items).filter(el => el.style.display !== 'none');

  const openAt = (index) => {
    visibleItems = getVisible();
    currentIndex = index;
    const item  = visibleItems[currentIndex];
    if (!item) return;

    const img   = item.querySelector('img');
    const title = item.dataset.title || '';
    const cat   = item.dataset.category || '';

    lightboxImg.src       = img?.src || img?.dataset.src || '';
    lightboxImg.alt       = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCat)   lightboxCat.textContent   = cat;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const prev = () => {
    visibleItems = getVisible();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openAt(currentIndex);
  };

  const next = () => {
    visibleItems = getVisible();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openAt(currentIndex);
  };

  // Attach triggers
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      visibleItems = getVisible();
      const vIdx   = visibleItems.indexOf(item);
      openAt(vIdx >= 0 ? vIdx : 0);
    });
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Swipe support
  let startX = 0;
  lightbox.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  }, { passive: true });
};

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
  initLightbox();
});
