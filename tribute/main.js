/* ═══════════════════════════════════════════════
   main.js — Shared JavaScript for all pages
   Teacher Appreciation Website
═══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   1. NAVIGATION
   - Sticky nav darkens on scroll
   - Hamburger menu for mobile
   - Highlights the active page link
────────────────────────────────────────────── */

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Darken nav on scroll
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Mobile hamburger toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
}

// Highlight the active page in the nav
(function markActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* ──────────────────────────────────────────────
   2. SCROLL REVEAL
   - Elements with class "reveal" fade in when
     they enter the viewport
   - Elements with class "stagger" animate their
     children in sequence
────────────────────────────────────────────── */

function initScrollReveal() {
  const revealEls  = document.querySelectorAll('.reveal');
  const staggerEls = document.querySelectorAll('.stagger');

  if (!revealEls.length && !staggerEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
  staggerEls.forEach(el => observer.observe(el));
}

initScrollReveal();


/* ──────────────────────────────────────────────
   3. GOLDEN PARTICLES (hero only)
   - Looks for a <div class="particles" id="particles">
   - Spawns animated floating dots
────────────────────────────────────────────── */

function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 28;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = [
      `left: ${Math.random() * 100}%`,
      `--dur: ${6 + Math.random() * 10}s`,
      `--delay: ${Math.random() * 10}s`,
      `--dx: ${(Math.random() - 0.5) * 80}px`
    ].join(';');
    container.appendChild(p);
  }
}

initParticles();


/* ──────────────────────────────────────────────
   4. HERO PARALLAX
   - On the home page hero background scrolls
     at a slower rate than the page
────────────────────────────────────────────── */

function initHeroParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight * 1.2) {
      heroBg.style.transform = `translateY(${offset * 0.28}px)`;
    }
  }, { passive: true });
}

initHeroParallax();


/* ──────────────────────────────────────────────
   5. PAGE HERO PARALLAX (inner pages)
   - Lighter parallax for the short hero banners
     on about.html, memories.html, etc.
────────────────────────────────────────────── */

function initPageHeroParallax() {
  const bg = document.querySelector('.page-hero-bg');
  if (!bg) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < 700) {
      bg.style.transform = `translateY(${offset * 0.18}px)`;
    }
  }, { passive: true });
}

initPageHeroParallax();


/* ──────────────────────────────────────────────
   6. GALLERY LIGHTBOX (gallery.html)
   - Click a gallery item to view it fullscreen
   - Close with Escape key or clicking outside
────────────────────────────────────────────── */

function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Build lightbox DOM
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(13,10,8,0.96);
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem;
  `;

  const lbImg = document.createElement('img');
  lbImg.style.cssText = `
    max-width: 90vw;
    max-height: 78vh;
    object-fit: contain;
    border: 1px solid rgba(201,168,76,0.25);
  `;

  const lbCaption = document.createElement('p');
  lbCaption.style.cssText = `
    margin-top: 1rem;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.06em;
    text-align: center;
  `;

  const lbClose = document.createElement('button');
  lbClose.innerHTML = '&times;';
  lbClose.setAttribute('aria-label', 'Close image viewer');
  lbClose.style.cssText = `
    position: absolute;
    top: 1.5rem; right: 1.5rem;
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
  `;
  lbClose.addEventListener('mouseenter', () => lbClose.style.color = '#C9A84C');
  lbClose.addEventListener('mouseleave', () => lbClose.style.color = 'rgba(255,255,255,0.5)');

  lb.appendChild(lbClose);
  lb.appendChild(lbImg);
  lb.appendChild(lbCaption);
  document.body.appendChild(lb);

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbCaption.textContent = caption || '';
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-caption');
      if (img) openLightbox(img.src, cap ? cap.textContent.trim() : '');
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

initLightbox();


/* ──────────────────────────────────────────────
   7. SMOOTH ANCHOR SCROLLING
   - Handles in-page # links with offset for
     the fixed nav bar
────────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = nav ? nav.offsetHeight : 70;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ──────────────────────────────────────────────
   8. LETTER PAGE — Typewriter effect (optional)
   - If there's an element with id="typewriter",
     this types out its data-text attribute
   - Add data-text="..." to the element in HTML
────────────────────────────────────────────── */

function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const text   = el.getAttribute('data-text') || el.textContent;
  const speed  = parseInt(el.getAttribute('data-speed') || '38', 10);
  el.textContent = '';
  el.style.borderRight = '2px solid #C9A84C';

  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Remove blinking cursor after done
      setTimeout(() => { el.style.borderRight = 'none'; }, 1200);
    }
  }

  // Only start when element is in view
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      type();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(el);
}

initTypewriter();


/* ──────────────────────────────────────────────
   9. YEAR AUTO-UPDATE (footer)
   - Keeps the copyright year current
   - Add <span id="year"></span> in your footer
────────────────────────────────────────────── */

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}