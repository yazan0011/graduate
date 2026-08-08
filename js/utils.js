/** Shared helpers */

export const isTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(pointer: coarse)').matches;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Phones + small tablets — dedicated mobile composition */
export const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

export const isTablet = () => window.matchMedia('(max-width: 1024px)').matches;

export const isPhone = () => window.matchMedia('(max-width: 720px)').matches;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export const mapRange = (value, inMin, inMax, outMin, outMax) =>
  outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);

export function whatsappUrl(number, message) {
  const digits = String(number).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Device tier for WebGL budget */
export function getDeviceTier() {
  if (prefersReducedMotion()) return 'minimal';
  if (isMobile()) return 'low';
  if (isTablet()) return 'medium';
  return 'high';
}

export function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve(src);
          img.src = src;
        })
    )
  );
}
