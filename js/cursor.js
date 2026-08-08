import { lerp, isTouchDevice } from './utils.js';

export function initCursor() {
  const root = document.getElementById('cursor');
  if (!root || isTouchDevice()) {
    document.body.classList.add('is-touch');
    return null;
  }

  const label = root.querySelector('.cursor__label');
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const target = { x: pos.x, y: pos.y };
  let raf = 0;

  const onMove = (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
    root.classList.remove('is-hidden');
  };

  const onLeave = () => root.classList.add('is-hidden');

  const tick = () => {
    pos.x = lerp(pos.x, target.x, 0.18);
    pos.y = lerp(pos.y, target.y, 0.18);
    root.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    raf = requestAnimationFrame(tick);
  };

  const setHover = (on, text = '') => {
    root.classList.toggle('is-hover', on);
    if (label) label.textContent = text;
  };

  const bindInteractive = () => {
    document.querySelectorAll('a, button, [data-cursor], .gallery__item, .portrait').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        setHover(true, el.dataset.cursor || 'VIEW');
      });
      el.addEventListener('mouseleave', () => setHover(false));
    });
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave);
  bindInteractive();
  raf = requestAnimationFrame(tick);

  return {
    rebind: bindInteractive,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    },
  };
}
