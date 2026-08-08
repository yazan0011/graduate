import { gsap, ScrollTrigger } from './vendor.js';
import { prefersReducedMotion, isMobile } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

function splitText(el) {
  if (!el || el.dataset.splitDone) return;
  const text = el.textContent;
  el.textContent = '';
  el.dataset.splitDone = '1';

  text.trim().split(/(\s+)/).forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(word));
      return;
    }
    if (!word) return;
    const wrap = document.createElement('span');
    wrap.className = 'split-word';
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    wrap.style.verticalAlign = 'top';

    [...word].forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = ch;
      span.style.display = 'inline-block';
      wrap.appendChild(span);
    });
    el.appendChild(wrap);
  });
}

function splitElementWithBreaks(el) {
  if (!el || el.dataset.splitDone) return;
  el.dataset.splitDone = '1';
  const nodes = Array.from(el.childNodes);
  const frag = document.createDocumentFragment();

  const processText = (text, parent) => {
    text.split(/(\s+)/).forEach((word) => {
      if (/^\s+$/.test(word)) {
        parent.appendChild(document.createTextNode(word));
        return;
      }
      if (!word) return;
      const wrap = document.createElement('span');
      wrap.className = 'split-word';
      wrap.style.display = 'inline-block';
      wrap.style.overflow = 'hidden';
      [...word].forEach((ch) => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = ch;
        wrap.appendChild(span);
      });
      parent.appendChild(wrap);
    });
  };

  // Rebuild from HTML to keep <br>
  const temp = document.createElement('div');
  temp.innerHTML = el.innerHTML;
  el.textContent = '';

  const walk = (source, target) => {
    source.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        processText(node.textContent, target);
      } else if (node.nodeName === 'BR') {
        target.appendChild(document.createElement('br'));
      } else {
        const clone = document.createElement(node.nodeName.toLowerCase());
        Array.from(node.attributes || []).forEach((a) => clone.setAttribute(a.name, a.value));
        walk(node, clone);
        target.appendChild(clone);
      }
    });
  };

  walk(temp, el);
}

export function initAnimations({ lenis, portraitScene }) {
  if (prefersReducedMotion()) {
    gsap.set(
      [
        '.hero__eyebrow',
        '.hero__names li',
        '.hero__made',
        '.hero__scroll',
        '.portrait',
        '.section__title',
        '.finale__names li',
        '.finale__class',
        '.finale__line',
      ],
      { opacity: 1, y: 0, clearProps: 'transform' }
    );
    return { refresh: () => ScrollTrigger.refresh() };
  }

  // Sync Lenis with ScrollTrigger
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Split titles
  document.querySelectorAll('[data-split]').forEach((el) => {
    if (el.innerHTML.includes('<br')) splitElementWithBreaks(el);
    else splitText(el);
  });

  // ── Hero entrance (after intro) ──
  gsap.set(['.hero__eyebrow', '.hero__names li', '.hero__made', '.hero__scroll'], {
    opacity: 0,
    y: 20,
  });

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1 }, 0)
    .fromTo(
      '.hero__title .split-char',
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.15, stagger: 0.018 },
      0.15
    )
    .to('.hero__names li', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.85)
    .to('.hero__made', { opacity: 1, y: 0, duration: 1 }, 1.2)
    .to('.hero__scroll', { opacity: 1, y: 0, duration: 0.8 }, 1.5);

  // Hero parallax (lighter on mobile)
  gsap.to('.hero__content', {
    y: isMobile() ? 40 : 120,
    opacity: isMobile() ? 0.55 : 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Section titles reveal
  document.querySelectorAll('.section__title').forEach((title) => {
    const chars = title.querySelectorAll('.split-char');
    if (!chars.length) {
      gsap.from(title, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: title, start: 'top 80%' },
      });
      return;
    }
    gsap.from(chars, {
      y: '110%',
      opacity: 0,
      duration: 1,
      stagger: 0.016,
      ease: 'power3.out',
      scrollTrigger: { trigger: title, start: 'top 82%' },
    });
  });

  // Portraits stagger
  gsap.from('.portrait', {
    opacity: 0,
    y: 80,
    duration: 1.3,
    stagger: 0.18,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#portraits', start: 'top 75%' },
  });

  const mobile = isMobile();

  // ── Space: desktop 3D scrub OR mobile stacked reveal ──
  const spaceSection = document.getElementById('space');
  if (spaceSection && !mobile && portraitScene) {
    ScrollTrigger.create({
      trigger: spaceSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        portraitScene.setProgress(self.progress);
      },
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: spaceSection,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
      .to('#space-line-a', { opacity: 1, y: 0, duration: 0.3 }, 0.55)
      .to('#space-line-b', { opacity: 1, y: 0, duration: 0.3 }, 0.7);
  }

  if (mobile) {
    gsap.from('.space__mobile-card', {
      opacity: 0,
      y: 48,
      duration: 1,
      stagger: 0.16,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#space-mobile-stack', start: 'top 80%' },
    });
    gsap.from('.space__mobile-line', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.space__mobile-line', start: 'top 90%' },
    });
  }

  // ── Journey: horizontal pin (desktop) / vertical stack (mobile) ──
  const track = document.getElementById('journey-track');
  const journeyPin = document.querySelector('.journey__pin');
  const progressBar = document.getElementById('journey-progress');

  if (track && journeyPin && !mobile) {
    const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const journeyTween = gsap.to(track, {
      x: () => -getScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#journey',
        pin: journeyPin,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getScroll() + window.innerHeight * 0.5}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressBar) progressBar.style.width = `${self.progress * 100}%`;
        },
      },
    });

    gsap.utils.toArray('.journey__item').forEach((item) => {
      const visual = item.querySelector('.journey__visual-inner');
      const year = item.querySelector('.journey__year');

      ScrollTrigger.create({
        trigger: item,
        containerAnimation: journeyTween,
        start: 'left 80%',
        end: 'left 30%',
        onEnter: () => {
          if (visual) {
            gsap.to(visual, {
              clipPath: 'inset(0 0% 0 0)',
              scale: 1,
              duration: 1.4,
              ease: 'power3.out',
            });
          }
          if (year) {
            gsap.fromTo(
              year,
              { opacity: 0.2, x: 40 },
              { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
            );
          }
        },
      });
    });
  }

  if (mobile) {
    gsap.utils.toArray('.journey__item').forEach((item) => {
      const visual = item.querySelector('.journey__visual-inner');
      gsap.from(item, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%' },
      });
      if (visual) {
        gsap.fromTo(
          visual,
          { clipPath: 'inset(0 100% 0 0)', scale: 1.08 },
          {
            clipPath: 'inset(0 0% 0 0)',
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 80%' },
          }
        );
      }
    });
  }

  // Gallery items
  gsap.from('.gallery__item', {
    opacity: 0,
    y: 60,
    rotate: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#gallery', start: 'top 75%' },
  });

  // Sculpture meta
  gsap.from('.sculpture__meta > *', {
    opacity: 0,
    y: 30,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#sculpture', start: 'top 60%' },
  });

  // Celebration
  gsap.from('.details > div', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#celebration', start: 'top 70%' },
  });

  gsap.from('.countdown__unit', {
    opacity: 0,
    y: 40,
    duration: 1.1,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#countdown', start: 'top 80%' },
  });

  // RSVP
  const rsvpChars = document.querySelectorAll('.rsvp__headline .split-char');
  if (rsvpChars.length) {
    gsap.from(rsvpChars, {
      y: '100%',
      opacity: 0,
      duration: 1,
      stagger: 0.014,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#rsvp', start: 'top 70%' },
    });
  }

  gsap.from('.rsvp__actions .btn', {
    opacity: 0,
    y: 24,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#rsvp', start: 'top 65%' },
  });

  // ── Finale cinematic sequence ──
  const finale = document.getElementById('finale');
  if (finale) {
    const finaleTl = gsap.timeline({
      scrollTrigger: {
        trigger: finale,
        start: 'top 55%',
        toggleActions: 'play none none reverse',
      },
    });

    finaleTl
      .to('.finale__names li', {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.45,
        ease: 'power3.out',
      })
      .to('.finale__class', { opacity: 1, duration: 1 }, '+=0.2')
      .to('#finale-line-a', { opacity: 1, y: 0, duration: 1.1 }, '+=0.35')
      .to('#finale-line-b', { opacity: 1, y: 0, duration: 1.1 }, '-=0.4')
      .to(
        '.finale__content',
        {
          opacity: 0,
          duration: 2.2,
          ease: 'power2.inOut',
          delay: 1.2,
        },
        '+=0.8'
      );
  }

  // Orb mouse follow (desktop)
  if (!isMobile()) {
    const orb = document.getElementById('orb');
    if (orb) {
      const onMove = (e) => {
        const rect = orb.parentElement.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(orb, {
          x: x * 30,
          y: y * 20,
          duration: 1.2,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };
      orb.parentElement?.addEventListener('pointermove', onMove);
    }
  }

  return {
    refresh: () => ScrollTrigger.refresh(),
  };
}
