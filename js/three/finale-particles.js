import { getDeviceTier, prefersReducedMotion } from '../utils.js';

/** Lightweight 2D particle field for the finale — GPU-friendly */
export function createFinaleParticles(canvas) {
  if (!canvas || prefersReducedMotion()) {
    if (canvas) canvas.style.display = 'none';
    return null;
  }

  const ctx = canvas.getContext('2d');
  const tier = getDeviceTier();
  const count = tier === 'low' ? 40 : 80;
  let w = 0;
  let h = 0;
  let running = false;
  let raf = 0;

  const particles = Array.from({ length: count }, () => ({
    x: 0,
    y: 0,
    r: 0,
    vx: 0,
    vy: 0,
    a: 0,
  }));

  const resize = () => {
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = w * Math.min(devicePixelRatio, 1.5);
    canvas.height = h * Math.min(devicePixelRatio, 1.5);
    ctx.setTransform(Math.min(devicePixelRatio, 1.5), 0, 0, Math.min(devicePixelRatio, 1.5), 0, 0);
    particles.forEach((p) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.r = 0.6 + Math.random() * 1.6;
      p.vx = (Math.random() - 0.5) * 0.25;
      p.vy = -0.1 - Math.random() * 0.35;
      p.a = 0.15 + Math.random() * 0.45;
    });
  };

  const render = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(185, 168, 138, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    raf = requestAnimationFrame(render);
  };

  resize();
  window.addEventListener('resize', resize);

  const io = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running) raf = requestAnimationFrame(render);
      else cancelAnimationFrame(raf);
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    },
  };
}
