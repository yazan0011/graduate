import { gsap } from './vendor.js';

export function initNavigation(lenis) {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  const links = document.querySelectorAll('.nav__links a, .nav-mobile a, .nav__logo');
  const sections = document.querySelectorAll('[data-section-root]');

  if (!nav) return;

  // Reveal nav after intro
  gsap.to(nav, { opacity: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
  nav.classList.add('is-visible');

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', y > 60);

    let current = 'hero';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.25) {
        current = sec.dataset.sectionRoot;
      }
    });

    document.querySelectorAll('.nav__links a').forEach((a) => {
      a.classList.toggle('is-active', a.dataset.section === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      if (mobile?.classList.contains('is-open')) {
        mobile.classList.remove('is-open');
        toggle?.classList.remove('is-open');
      }

      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('is-open');
    mobile?.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobile?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      document.body.style.overflow = '';
    });
  });
}
