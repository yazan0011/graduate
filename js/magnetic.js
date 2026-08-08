import { isTouchDevice, lerp } from './utils.js';

export function initMagneticButtons() {
  if (isTouchDevice()) return;

  document.querySelectorAll('.btn--magnetic').forEach((btn) => {
    const strength = 0.35;
    let raf = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const tick = () => {
      current.x = lerp(current.x, target.x, 0.12);
      current.y = lerp(current.y, target.y, 0.12);
      btn.style.transform = `translate(${current.x}px, ${current.y}px)`;
      raf = requestAnimationFrame(tick);
    };

    btn.addEventListener('mouseenter', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      target.x = (e.clientX - cx) * strength;
      target.y = (e.clientY - cy) * strength;
    });

    btn.addEventListener('mouseleave', () => {
      target.x = 0;
      target.y = 0;
      setTimeout(() => cancelAnimationFrame(raf), 400);
    });
  });
}
