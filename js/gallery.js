import { gsap } from './vendor.js';
import { CONFIG } from './config.js';
import { prefersReducedMotion, isMobile } from './utils.js';

export function renderGallery() {
  const root = document.getElementById('gallery');
  if (!root) return;
  const mobile = isMobile();

  root.innerHTML = CONFIG.gallery
    .map(
      (item, i) => `
      <figure class="gallery__item" data-size="${item.size}" data-index="${i}" data-cursor="OPEN" style="--rot: ${mobile ? 0 : (i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.4)}deg">
        <img src="${item.src}" alt="${item.caption}" loading="lazy" decoding="async" />
        <figcaption class="gallery__caption">${item.caption}</figcaption>
      </figure>`
    )
    .join('');
}

export function renderMobileSpace() {
  const stack = document.getElementById('space-mobile-stack');
  if (!stack) return;

  stack.innerHTML = CONFIG.graduates
    .map(
      (g, i) => `
      <figure class="space__mobile-card">
        <div class="space__mobile-media">
          <img src="${g.image}" alt="${g.fullName}" loading="lazy" decoding="async" />
        </div>
        <figcaption>
          <span class="space__mobile-index">0${i + 1}</span>
          <span class="space__mobile-name">${g.name}</span>
          <span class="space__mobile-field">${g.field}</span>
        </figcaption>
      </figure>`
    )
    .join('');
}

export function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox?.querySelector('.lightbox__close');
  const gallery = document.getElementById('gallery');
  if (!lightbox || !gallery) return;

  const open = (item) => {
    const data = CONFIG.gallery[Number(item.dataset.index)];
    if (!data) return;
    img.src = data.src;
    img.alt = data.caption;
    caption.textContent = data.caption;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    const done = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      lightbox.removeEventListener('transitionend', done);
    };
    lightbox.addEventListener('transitionend', done);
    setTimeout(done, 700);
  };

  gallery.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery__item');
    if (item) open(item);
  });

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}

export function initPortraitCards() {
  const root = document.getElementById('portraits');
  if (!root) return;

  root.innerHTML = CONFIG.graduates
    .map(
      (g, i) => `
      <article class="portrait" data-cursor="EXPLORE" style="--i:${i}">
        <div class="portrait__media">
          <img src="${g.image}" alt="${g.fullName}" loading="lazy" decoding="async" />
          <div class="portrait__shade"></div>
          <div class="portrait__glow"></div>
        </div>
        <div class="portrait__meta">
          <p class="portrait__index">0${i + 1}</p>
          <h3 class="portrait__name">${g.name}</h3>
          <p class="portrait__field">${g.field}</p>
          <p class="portrait__quote">${g.quote}</p>
        </div>
      </article>`
    )
    .join('');

  if (prefersReducedMotion() || isMobile()) return;

  root.querySelectorAll('.portrait').forEach((card) => {
    const glow = card.querySelector('.portrait__glow');

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 10;
      const ry = (x - 0.5) * 12;

      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      if (glow) {
        glow.style.setProperty('--mx', `${x * 100}%`);
        glow.style.setProperty('--my', `${y * 100}%`);
      }
    });

    card.addEventListener('pointerleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    });
  });
}

export function renderJourney() {
  const track = document.getElementById('journey-track');
  if (!track) return;

  const images = [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c39?w=900&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80',
  ];

  track.innerHTML = CONFIG.journey
    .map(
      (item, i) => `
      <article class="journey__item" data-journey="${i}">
        <p class="journey__year">${item.year}</p>
        <h3 class="journey__title">${item.title}</h3>
        <p class="journey__caption">${item.caption}</p>
        <div class="journey__visual">
          <div class="journey__visual-inner" style="background-image:url('${images[i % images.length]}')"></div>
        </div>
      </article>`
    )
    .join('');
}

export function hydrateContent() {
  // Hero names
  const heroNames = document.getElementById('hero-names');
  if (heroNames) {
    heroNames.innerHTML = CONFIG.graduates.map((g) => `<li>${g.name}</li>`).join('');
  }

  // Intro already handled in intro.js
  document.querySelectorAll('#sculpture-names, #finale-names').forEach((list) => {
    list.innerHTML = CONFIG.graduates.map((g) => `<li>${g.name}</li>`).join('');
  });

  // Event details
  const date = document.querySelector('[data-event="date"]');
  const time = document.querySelector('[data-event="time"]');
  const location = document.querySelector('[data-event="location"]');
  if (date) date.textContent = CONFIG.event.date;
  if (time) time.textContent = CONFIG.event.time;
  if (location) location.textContent = CONFIG.event.location;

  const locBtn = document.getElementById('location-btn');
  if (locBtn) locBtn.href = CONFIG.event.locationUrl;

  // Hero copy
  const lines = document.querySelectorAll('.hero__line');
  if (lines[0]) lines[0].textContent = CONFIG.hero.line1;
  if (lines[1]) lines[1].textContent = CONFIG.hero.line2;

  const eyebrow = document.querySelector('.hero__eyebrow');
  if (eyebrow) eyebrow.textContent = CONFIG.hero.tagline;

  // RSVP
  const rsvpH = document.querySelector('.rsvp__headline');
  const rsvpS = document.querySelector('.rsvp__sub');
  if (rsvpH) rsvpH.textContent = CONFIG.rsvp.headline;
  if (rsvpS) rsvpS.textContent = CONFIG.rsvp.subtext;

  const primary = document.querySelector('#rsvp-primary span');
  const secondary = document.querySelector('#rsvp-secondary span');
  if (primary) primary.textContent = CONFIG.rsvp.primary;
  if (secondary) secondary.textContent = CONFIG.rsvp.secondary;

  const finaleA = document.getElementById('finale-line-a');
  const finaleB = document.getElementById('finale-line-b');
  if (finaleA) finaleA.textContent = CONFIG.finale.line1;
  if (finaleB) finaleB.textContent = CONFIG.finale.line2;

  document.querySelector('.finale__class') &&
    (document.querySelector('.finale__class').textContent = `CLASS OF ${CONFIG.classOf}`);
  document.querySelector('.sculpture__year') &&
    (document.querySelector('.sculpture__year').textContent = CONFIG.classOf);
}
