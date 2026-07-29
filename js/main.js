/**
 * VATZ - Premium Creative Digital Agency
 * Main JavaScript Module
 * ============================================
 */

'use strict';

/* Respect user's reduced-motion preference across all effects below */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   NAVBAR
   ============================================ */
const initNavbar = () => {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  // Scroll effect: sticky style + hide-on-down / show-on-up
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Add scrolled class for compact sticky style
    navbar.classList.toggle('scrolled', currentScrollY > 50);

    // Hide navbar when scrolling DOWN past 120px; show on scroll UP
    if (currentScrollY > 120) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down — hide
        navbar.classList.add('nav-hidden');
      } else {
        // Scrolling up — reveal with smooth entry
        navbar.classList.remove('nav-hidden');
      }
    } else {
      // Near top — always show
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll(); // run on load

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'nav-menu');
    navMenu.id = navMenu.id || 'nav-menu';

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click (desktop) or backdrop tap (mobile)
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

/* ============================================
   SMOOTH SCROLL
   ============================================ */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
};

/* ============================================
   SCROLL REVEAL
   ============================================ */
const initScrollReveal = () => {
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const allElements   = document.querySelectorAll(revealClasses.join(','));

  if (!allElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  allElements.forEach(el => observer.observe(el));
};

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const animateCounter = (el) => {
  const target   = parseInt(el.dataset.target || el.textContent, 10);
  const suffix   = el.dataset.suffix || '';

  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }

  const duration = 2000;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, step);
};

const initCounters = () => {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
};

/* ============================================
   MARQUEE DUPLICATION
   ============================================ */
const initMarquee = () => {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Duplicate items for seamless loop
  const items = track.innerHTML;
  track.innerHTML = items + items;
};

/* ============================================
   PARALLAX EFFECT
   ============================================ */
const initParallax = () => {
  if (prefersReducedMotion) return;
  const orbs = document.querySelectorAll('.hero-bg-orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 15;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
};

/* ============================================
   SCROLL TO TOP
   ============================================ */
const initScrollTop = () => {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ============================================
   BUTTON RIPPLE
   ============================================ */
const initRipple = () => {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple  = document.createElement('span');
      const rect    = this.getBoundingClientRect();
      const size    = Math.max(rect.width, rect.height);
      const x       = e.clientX - rect.left - size / 2;
      const y       = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position: 'absolute',
        width: `${size}px`, height: `${size}px`,
        left: `${x}px`,    top:  `${y}px`,
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple-anim 0.6s linear',
        pointerEvents: 'none',
      });

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Add ripple keyframe
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(4); opacity: 0; }
      }`;
    document.head.appendChild(style);
  }
};

/* ============================================
   TYPED TEXT EFFECT (Hero)
   ============================================ */
const initTyped = () => {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = ['Visual Design', 'Audio Production', 'Tech Solutions', 'Brand Identity', 'AI Innovation'];
  let wordIdx = 0, charIdx = 0, isDeleting = false;

  const type = () => {
    const word    = words[wordIdx];
    const current = isDeleting ? word.slice(0, charIdx - 1) : word.slice(0, charIdx + 1);

    el.textContent = current;
    charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === word.length) {
      isDeleting = true;
      delay = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx    = (wordIdx + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  };

  type();
};

/* ============================================
   CURSOR GLOW (Optional Ambient)
   ============================================ */
const initCursorGlow = () => {
  if (prefersReducedMotion) return;
  const cursor = document.getElementById('cursor-glow');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }, { passive: true });
};

/* ============================================
   CUSTOM CURSOR — ring + dot with lag
   ============================================ */
const initCustomCursor = () => {
  // Don't run on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Inject elements if not already in HTML
  let ring = document.getElementById('cursor-ring');
  let dot  = document.getElementById('cursor-dot');

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    document.body.appendChild(ring);
  }
  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);
  }

  // Mouse position (target)
  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  // Ring position (lagged)
  let ringX  = mouseX;
  let ringY  = mouseY;

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  }, { passive: true });

  // Lerp ring position each frame for lag effect
  const lerp = (a, b, t) => a + (b - a) * t;
  const animateRing = () => {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover state — expand ring on interactive elements
  const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .filter-btn, .masonry-item, .project-card, .glass-card, .neo-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('cursor-hover');
    }
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('cursor-hover');
    }
  }, { passive: true });

  // Click state
  document.addEventListener('mousedown', () => {
    ring.classList.add('cursor-click');
    ring.classList.remove('cursor-hover');
  }, { passive: true });
  document.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-click');
  }, { passive: true });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  }, { passive: true });
  document.addEventListener('mouseenter', () => {
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  }, { passive: true });
};

/* ============================================
   CANVAS PARTICLE BACKGROUND
   ============================================ */
const initParticles = () => {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId;

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const createParticle = () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     Math.random() * 1.5 + 0.5,
    dx:    (Math.random() - 0.5) * 0.4,
    dy:    (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '109,40,255' : '59,130,246',
  });

  for (let i = 0; i < 80; i++) {
    particles.push(createParticle());
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    animId = requestAnimationFrame(draw);
  };

  draw();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
};

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
const initTestimonialSlider = () => {
  const slides  = document.querySelectorAll('.testimonial-slide');
  const dots    = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('test-prev');
  const nextBtn = document.getElementById('test-next');
  if (!slides.length) return;

  let current = 0;

  const goTo = (n) => {
    // Hide all slides properly (override inline display:none)
    slides.forEach((s, i) => {
      s.style.display = 'none';
      s.classList.remove('active');
      dots[i]?.classList.remove('active');
    });
    current = (n + slides.length) % slides.length;
    slides[current].style.display = 'block';
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  goTo(0);
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto advance
  let autoTimer = setInterval(() => goTo(current + 1), 5000);
  const sliderWrap = document.querySelector('.testimonial-slider');
  sliderWrap?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  sliderWrap?.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo(current + 1), 5000); });
};

/* ============================================
   IMAGE FALLBACK
   Hotlinked (Unsplash) images can fail to load
   (offline, blocked, rate-limited). Swap in a
   branded gradient placeholder instead of a
   broken-image icon.
   ============================================ */
const initImageFallback = () => {
  const PLACEHOLDER =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#6D28FF"/><stop offset="100%" stop-color="#3B82F6"/>' +
      '</linearGradient></defs>' +
      '<rect width="100%" height="100%" fill="#141414"/>' +
      '<rect width="100%" height="100%" fill="url(#g)" opacity="0.25"/>' +
      '</svg>'
    );

  document.querySelectorAll('img[src*="images.unsplash.com"]').forEach((img) => {
    img.addEventListener('error', () => {
      img.src = PLACEHOLDER;
      img.classList.add('img-fallback');
    }, { once: true });
  });
};

/* ============================================
   SOLUTIONS HERO IMAGE SLIDER
   3 cards rotate through slots: left · center · right
   Center slot is always the active/front card.
   Runs only on pages that have #solHeroSlider.
   ============================================ */
const initSolHeroSlider = () => {
  const slider = document.getElementById('solHeroSlider');
  if (!slider) return;

  const INTERVAL = 3400;
  const SLOTS    = ['slot-left', 'slot-center', 'slot-right'];
  const cards    = Array.from(slider.querySelectorAll('.sol-img-card'));
  const total    = cards.length;

  let centerIdx = 1; // card[1] starts in center (matches HTML initial state)
  let timer;

  const applySlots = () => {
    cards.forEach((card, i) => {
      card.classList.remove(...SLOTS);
      const rel = ((i - centerIdx) % total + total) % total;
      if      (rel === 0) card.classList.add('slot-center');
      else if (rel === 1) card.classList.add('slot-right');
      else                card.classList.add('slot-left');
    });
  };

  const advance = () => {
    centerIdx = (centerIdx + 1) % total;
    applySlots();
  };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(advance, INTERVAL);
  };

  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', () => startTimer());

  applySlots();
  startTimer();
};


/* ============================================
   PAGE LOADER
   ============================================
   Strategy
   ─────────
   • Simulates realistic progress in two phases:
       Phase 1 (DOMContentLoaded)  → runs bar to ~85 % at a natural pace
       Phase 2 (window.load)       → sprints remaining gap to 100 %,
                                     then triggers the curtain-wipe exit
   • Falls back to a hard 6 s timeout so the loader *always* clears
     even if window.load never fires (heavy assets, offline, etc.)
   • Respects prefers-reduced-motion: skips ticks, dismisses instantly
   • Idempotent — safe to call on pages without #page-loader present
   ============================================ */
const initPageLoader = () => {
  const loader  = document.getElementById('page-loader');
  if (!loader) return;

  const bar     = loader.querySelector('.loader-bar');
  const pctEl   = loader.querySelector('.loader-pct');

  let progress  = 0;       // 0–100
  let tickerId  = null;
  let dismissed = false;

  /* ── Reduced-motion: skip everything, dismiss immediately ── */
  if (prefersReducedMotion) {
    loader.classList.add('loader-exit');
    document.body.classList.add('loader-hidden');
    return;
  }

  /* ── Update bar width + counter label ── */
  const setProgress = (val) => {
    progress = Math.min(Math.max(val, progress), 100); // monotonic, 0-100
    if (bar)   bar.style.width  = progress + '%';
    if (pctEl) pctEl.textContent = Math.round(progress);
  };

  /* ── Dismiss: add exit class → CSS curtain wipes up, then fade out ── */
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    clearInterval(tickerId);

    setProgress(100);

    /* Small pause at 100 % so user sees the completed state */
    setTimeout(() => {
      loader.classList.add('loader-exit');
      document.body.classList.add('loader-hidden');

      /* Remove from DOM after all CSS transitions finish (~950 ms total) */
      loader.addEventListener('transitionend', () => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, { once: true });
    }, 220);
  };

  /* ── Phase 1: natural tick toward ~85 % (starts immediately) ── */
  const PHASE1_TARGET = 85;
  const TICK_INTERVAL = 35;   // ms between ticks

  tickerId = setInterval(() => {
    if (progress >= PHASE1_TARGET) {
      clearInterval(tickerId);
      return;
    }
    /* Eased increment — fast at start, slows near target */
    const remaining = PHASE1_TARGET - progress;
    const step      = Math.max(0.4, remaining * 0.045);
    setProgress(progress + step);
  }, TICK_INTERVAL);

  /* ── Phase 2: window.load → sprint to 100 % and dismiss ── */
  const onLoaded = () => {
    clearInterval(tickerId);

    /* Animate remaining gap quickly (from current position to 100) */
    const sprint = setInterval(() => {
      if (progress >= 100) {
        clearInterval(sprint);
        dismiss();
        return;
      }
      const remaining = 100 - progress;
      const step      = Math.max(1, remaining * 0.18);
      setProgress(progress + step);
    }, TICK_INTERVAL);
  };

  if (document.readyState === 'complete') {
    /* Page already fully loaded (e.g. back/forward cache hit) */
    onLoaded();
  } else {
    window.addEventListener('load', onLoaded, { once: true });
  }

  /* ── Safety net: always dismiss within 6 s ── */
  setTimeout(() => {
    if (!dismissed) dismiss();
  }, 6000);
};

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();   // First — locks scroll & starts progress before any paint
  initTheme();        // Must be first — sets [data-theme] before any paint
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initMarquee();
  initParallax();
  initScrollTop();
  initRipple();
  initTyped();
  initCursorGlow();
  initCustomCursor();
  initParticles();
  initTestimonialSlider();
  initImageFallback();
  initSolHeroSlider();
  initScheduleModal();
  initWaWidget();
  initPortfolioLightbox();
  initCareersFilter();
  initBlogFilter();
  initReadingProgress();
  initTocHighlight();
});


/* ============================================
   MEGA MENU
   — 2 s stagger-delay before items animate in
   — Items enter one-by-one (open) and exit
     one-by-one in reverse (close)
   — Header hide/show on scroll mirrors old navbar
   ============================================ */
const initMegaMenu = () => {
  const header   = document.getElementById('site-header');
  const trigger  = document.querySelector('.mega-menu-trigger');
  const overlay  = document.querySelector('.mega-menu-overlay');
  if (!header || !trigger || !overlay) return;

  /* Collect animated nodes inside the overlay in DOM order */
  const mmItems     = Array.from(overlay.querySelectorAll('.mm-item, .mm-item-divider, .mm-info-panel'));
  const mmFooter    = overlay.querySelector('.mm-footer');

  /* Timing constants (ms) */
  const OPEN_OVERLAY_DELAY   = 80;   // overlay fade-in starts almost immediately
  const OPEN_ITEMS_DELAY     = 1000; // stagger starts 1 s after button click
  const ITEM_STAGGER         = 80;   // gap between each item entering
  const CLOSE_ITEMS_DELAY    = 1000; // stagger starts 1 s after close click
  const ITEM_STAGGER_CLOSE   = 60;   // gap between each item exiting (reversed)
  const OVERLAY_FADE_AFTER   = 450;  // ms to wait after last item exits before hiding overlay

  let isOpen        = false;
  let openTimers    = [];
  let closeTimers   = [];

  /* ---- helpers ---- */
  const clearAll = () => {
    openTimers.forEach(clearTimeout);
    closeTimers.forEach(clearTimeout);
    openTimers  = [];
    closeTimers = [];
  };

  const resetItems = () => {
    mmItems.forEach(el => {
      el.classList.remove('mm-item-visible', 'mm-item-exit');
    });
    if (mmFooter) mmFooter.classList.remove('mm-item-visible', 'mm-item-exit');
  };

  /* ---- open ---- */
  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    clearAll();
    resetItems();
    document.body.style.overflow = 'hidden';

    trigger.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');

    /* 1. Fade overlay in */
    openTimers.push(setTimeout(() => {
      overlay.classList.add('mm-opening');
      overlay.classList.remove('mm-closing');
    }, OPEN_OVERLAY_DELAY));

    /* 2. After 2 s, stagger items in */
    mmItems.forEach((el, i) => {
      openTimers.push(setTimeout(() => {
        el.classList.add('mm-item-visible');
      }, OPEN_ITEMS_DELAY + i * ITEM_STAGGER));
    });

    /* 3. Footer enters after all items */
    const footerDelay = OPEN_ITEMS_DELAY + mmItems.length * ITEM_STAGGER + 40;
    if (mmFooter) {
      openTimers.push(setTimeout(() => {
        mmFooter.classList.add('mm-item-visible');
      }, footerDelay));
    }
  };

  /* ---- close ---- */
  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;
    clearAll();
    document.body.style.overflow = '';

    trigger.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');

    /* 1. After 2 s, stagger items OUT in reverse order */
    const reversedItems = [...mmItems].reverse();

    /* Footer exits first */
    if (mmFooter) {
      closeTimers.push(setTimeout(() => {
        mmFooter.classList.remove('mm-item-visible');
        mmFooter.classList.add('mm-item-exit');
      }, CLOSE_ITEMS_DELAY));
    }

    reversedItems.forEach((el, i) => {
      closeTimers.push(setTimeout(() => {
        el.classList.remove('mm-item-visible');
        el.classList.add('mm-item-exit');
      }, CLOSE_ITEMS_DELAY + (i + 1) * ITEM_STAGGER_CLOSE));
    });

    /* 2. Fade out overlay after all items gone */
    const totalExit = CLOSE_ITEMS_DELAY + reversedItems.length * ITEM_STAGGER_CLOSE + OVERLAY_FADE_AFTER;
    closeTimers.push(setTimeout(() => {
      overlay.classList.remove('mm-opening');
      overlay.classList.add('mm-closing');
      /* Clean state after fade */
      setTimeout(resetItems, 520);
    }, totalExit));
  };

  /* ---- trigger click ---- */
  trigger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  /* ---- close on Escape ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  /* ---- close when a menu link is clicked ---- */
  overlay.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) closeMenu();
    });
  });

  /* ---- Header scroll behaviour (same logic as old navbar) ---- */
  let lastY   = window.scrollY;
  let ticking = false;

  const handleHeaderScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('header-scrolled', y > 50);

    if (y > 120) {
      if (y > lastY) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    } else {
      header.classList.remove('header-hidden');
    }
    lastY   = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleHeaderScroll);
      ticking = true;
    }
  }, { passive: true });

  handleHeaderScroll();

  /* ---- Active link detection ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  overlay.querySelectorAll('.mm-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('mm-active');
    }
  });
  document.querySelectorAll('.header-nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
};

/* Hook into DOMContentLoaded — safe even if this script is deferred */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMegaMenu);
} else {
  initMegaMenu();
}


/* ============================================
   SCHEDULE A CALL MODAL  (index.html)
   ============================================ */
const initScheduleModal = () => {
  const modal   = document.getElementById('schedule-modal');
  const form    = document.getElementById('schedule-form');
  const success = document.getElementById('schedule-success');
  if (!modal) return;

  const open = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (form)    form.style.display    = '';
      if (success) success.style.display = 'none';
    }, 400);
  };

  /* Expose globally so onclick="openScheduleModal()" in HTML still works */
  window.openScheduleModal  = open;
  window.closeScheduleModal = close;

  /* Backdrop click */
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  /* Escape key — avoid duplicating the mega-menu listener */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });

  /* Form submit */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.modal-submit-btn');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';
        btn.disabled  = true;
      }
      setTimeout(() => {
        form.style.display          = 'none';
        if (success) success.style.display = 'flex';
      }, 1600);
    });
  }
};

/* ============================================
   WHATSAPP FLOATING WIDGET  (index.html)
   ============================================ */
const initWaWidget = () => {
  const widget = document.getElementById('wa-widget');
  if (!widget) return;

  let shown = false;

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!shown) {
        widget.classList.add('wa-show-tooltip');
        shown = true;
      }
    }, 3000);
  });

  /* Expose globally for onclick="closeWaTooltip()" */
  window.closeWaTooltip = () => widget.classList.remove('wa-show-tooltip');
};

/* ============================================
   PORTFOLIO LIGHTBOX OVERRIDE  (portfolio.html)
   Uses CSS-gradient tiles instead of img src
   ============================================ */
const initPortfolioLightbox = () => {
  const items    = document.querySelectorAll('.masonry-item[data-lightbox]');
  const lb       = document.getElementById('lightbox');
  if (!items.length || !lb) return;

  const visual   = document.getElementById('lightbox-visual');
  const lbTitle  = document.getElementById('lightbox-title');
  const lbCat    = document.getElementById('lightbox-cat');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn  = lb.querySelector('.lightbox-prev');
  const nextBtn  = lb.querySelector('.lightbox-next');

  let current = 0;
  let visible = [];

  const getVisible = () => Array.from(items).filter(el => el.style.display !== 'none');

  const openAt = (idx) => {
    visible  = getVisible();
    current  = idx;
    const item = visible[current];
    if (!item) return;
    const inner = item.querySelector('div');
    if (visual) {
      visual.style.background = inner ? getComputedStyle(inner).background : '';
      visual.textContent      = inner ? inner.textContent : '';
    }
    if (lbTitle) lbTitle.textContent = item.dataset.title    || '';
    if (lbCat)   lbCat.textContent   = item.dataset.category || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      visible = getVisible();
      openAt(visible.indexOf(item));
    });
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click',  () => { visible = getVisible(); openAt((current - 1 + visible.length) % visible.length); });
  nextBtn?.addEventListener('click',  () => { visible = getVisible(); openAt((current + 1) % visible.length); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  { visible = getVisible(); openAt((current - 1 + visible.length) % visible.length); }
    if (e.key === 'ArrowRight') { visible = getVisible(); openAt((current + 1) % visible.length); }
  });
};

/* ============================================
   CAREERS — DEPARTMENT JOB FILTER
   ============================================ */
const initCareersFilter = () => {
  const grid    = document.getElementById('jobs-grid');
  const noJobs  = document.getElementById('no-jobs');
  const buttons = document.querySelectorAll('.dept-filter-btn');
  if (!grid) return;

  /* Expose globally for onclick="filterJobs(...)" in HTML */
  window.filterJobs = (dept, btn) => {
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const cards = grid.querySelectorAll('.job-card');
    let visible = 0;
    cards.forEach(card => {
      const show = dept === 'all' || card.dataset.dept === dept;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (noJobs) noJobs.style.display = visible === 0 ? 'block' : 'none';
  };
};

/* ============================================
   BLOG — CATEGORY POST FILTER
   ============================================ */
const initBlogFilter = () => {
  const grid    = document.getElementById('articles-grid');
  const buttons = document.querySelectorAll('.cat-filter-btn');
  if (!grid) return;

  /* Expose globally for onclick="filterPosts(...)" in HTML */
  window.filterPosts = (cat, btn) => {
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    grid.querySelectorAll('.article-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  };
};

/* ============================================
   BLOG DETAIL — READING PROGRESS BAR
   ============================================ */
const initReadingProgress = () => {
  const bar     = document.getElementById('read-progress');
  const article = document.getElementById('article-content');
  if (!bar || !article) return;

  window.addEventListener('scroll', () => {
    const rect    = article.getBoundingClientRect();
    const total   = article.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const pct     = Math.min(Math.max((scrolled / total) * 100, 0), 100);
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
};

/* ============================================
   BLOG DETAIL — ACTIVE TOC HIGHLIGHT ON SCROLL
   ============================================ */
const initTocHighlight = () => {
  const sections = document.querySelectorAll('.article-body h2[id]');
  const links    = document.querySelectorAll('.toc-link');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => obs.observe(s));
};

/* ============================================================
   THEME TOGGLE
   - Reads saved preference from localStorage on every page load
   - Falls back to OS prefers-color-scheme on first visit
   - Writes chosen theme to <html data-theme="..."> so CSS picks it up
   - Wires all .theme-toggle buttons (one per page in the header)
   - Dispatches a custom 'themechange' event for any other scripts to hook into
   ============================================================ */
const initTheme = () => {
  const STORAGE_KEY = 'vatz-theme';
  const DARK        = 'dark';
  const LIGHT       = 'light';
  const root        = document.documentElement;

  /* Animation duration must match CSS (icon-out: 0.28s + icon-in delay 0.08s + 0.35s ≈ 450ms) */
  const ANIM_DURATION = 460;

  /* ── Determine initial theme — runs before first paint ── */
  const saved   = localStorage.getItem(STORAGE_KEY);
  const osDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (osDark ? DARK : LIGHT);

  root.setAttribute('data-theme', initial);

  /* ── Sync aria attributes on all toggle buttons ── */
  const syncAria = (theme) => {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label',   theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', theme === LIGHT ? 'true' : 'false');
    });
  };

  /* ── Apply theme: set data-theme, persist, sync aria, fire event ── */
  const applyTheme = (theme, animate = false) => {
    if (animate) {
      /* Trigger icon-swap animation on every button, then flip the theme */
      const switchClass = theme === LIGHT ? 'theme-switching-to-light' : 'theme-switching-to-dark';

      document.querySelectorAll('.theme-toggle').forEach(btn => {
        /* Prevent double-firing while animation is running */
        if (btn.dataset.switching) return;
        btn.dataset.switching = '1';
        btn.classList.add(switchClass);

        /* After animation completes, clean up classes */
        setTimeout(() => {
          btn.classList.remove(switchClass);
          delete btn.dataset.switching;
        }, ANIM_DURATION);
      });

      /* Apply the new theme mid-animation (icon-out finishes at ~0.28s, new
         theme lands just as icon-in begins at 0.08s offset → seamless) */
      setTimeout(() => {
        root.setAttribute('data-theme', theme);
        syncAria(theme);
        root.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
      }, 120);

    } else {
      /* Silent apply — initial load, no animation */
      root.setAttribute('data-theme', theme);
      syncAria(theme);
      root.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    localStorage.setItem(STORAGE_KEY, theme);
  };

  /* Sync aria on load (no animation on first render) */
  syncAria(initial);

  /* ── Wire every .theme-toggle button ── */
  const bindToggle = (btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.switching) return; /* debounce rapid clicks */
      const current = root.getAttribute('data-theme') || DARK;
      applyTheme(current === DARK ? LIGHT : DARK, true);
    });
  };

  document.querySelectorAll('.theme-toggle').forEach(bindToggle);

  /* ── Follow OS preference changes only when user hasn't manually chosen ── */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT, false);
    }
  });
};
