import { gsap } from './vendor.js';
import { CONFIG } from './config.js';
import { prefersReducedMotion } from './utils.js';

let dismissed = false;

export function dismissIntro() {
  if (dismissed) return;
  dismissed = true;
  const intro = document.getElementById('intro');
  if (!intro) return;
  intro.classList.add('is-done');
  intro.style.opacity = '0';
  intro.style.visibility = 'hidden';
  intro.style.pointerEvents = 'none';
  document.body.classList.remove('is-loading');
  // Fully remove after fade so it never blocks
  setTimeout(() => {
    intro.style.display = 'none';
  }, 900);
}

export function runIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return Promise.resolve();

  const light = intro.querySelector('.intro__light');
  const names = intro.querySelectorAll('[data-intro-name]');
  const year = intro.querySelector('.intro__year');
  const particlesRoot = document.getElementById('intro-particles');

  names.forEach((el, i) => {
    if (CONFIG.graduates[i]) el.textContent = CONFIG.graduates[i].name;
  });
  if (year) year.textContent = `CLASS OF ${CONFIG.classOf}`;

  if (prefersReducedMotion()) {
    dismissIntro();
    return Promise.resolve();
  }

  const particles = [];
  if (particlesRoot) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span');
      p.className = 'intro__particle';
      p.style.left = `${20 + Math.random() * 60}%`;
      p.style.top = `${20 + Math.random() * 60}%`;
      particlesRoot.appendChild(p);
      particles.push(p);
    }
  }

  document.body.classList.add('is-loading');

  return new Promise((resolve) => {
    // Hard timeout so we never stick on black
    const safety = setTimeout(() => {
      dismissIntro();
      resolve();
    }, 9000);

    try {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          clearTimeout(safety);
          dismissIntro();
          resolve();
        },
      });

      tl.to(light, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.inOut' }, 0.2)
        .to(
          light,
          {
            scale: 80,
            duration: 2.0,
            ease: 'power2.inOut',
            opacity: 0.55,
          },
          1.0
        )
        .to(
          particles,
          {
            opacity: () => 0.2 + Math.random() * 0.6,
            duration: 1.0,
            stagger: { each: 0.03, from: 'center' },
            x: () => (Math.random() - 0.5) * 120,
            y: () => (Math.random() - 0.5) * 120,
          },
          1.3
        )
        .to(
          names,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.28,
            ease: 'power3.out',
          },
          2.0
        )
        .to(year, { opacity: 1, duration: 0.7 }, 3.0)
        .to(
          [names, year, particles, light],
          {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
          },
          3.8
        )
        .to(
          intro,
          {
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          4.3
        );
    } catch (err) {
      console.warn('Intro animation failed:', err);
      clearTimeout(safety);
      dismissIntro();
      resolve();
    }
  });
}
