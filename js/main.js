import { Lenis } from './vendor.js';
import { CONFIG } from './config.js';
import { whatsappUrl, prefersReducedMotion, preloadImages, isMobile } from './utils.js';
import { runIntro, dismissIntro } from './intro.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initMagneticButtons } from './magnetic.js';
import { initCountdown } from './countdown.js';
import {
  hydrateContent,
  renderGallery,
  renderJourney,
  renderMobileSpace,
  initPortraitCards,
  initLightbox,
} from './gallery.js';
import { initAnimations } from './animations.js';
import { createHeroScene } from './three/hero-scene.js';
import { createPortraitScene } from './three/portrait-scene.js';
import { createSculptureScene } from './three/sculpture-scene.js';
import { createFinaleParticles } from './three/finale-particles.js';

function revealPage() {
  dismissIntro();
  document.body.classList.remove('is-loading');
  document.documentElement.classList.add('is-ready');
}

async function boot() {
  const mobile = isMobile();
  document.documentElement.classList.toggle('is-mobile', mobile);
  document.body.classList.toggle('is-mobile', mobile);

  hydrateContent();
  initPortraitCards();
  renderGallery();
  renderJourney();
  renderMobileSpace();
  initLightbox();
  initCountdown();
  initMagneticButtons();

  const wa = whatsappUrl(CONFIG.whatsapp.number, CONFIG.whatsapp.message);
  const primary = document.getElementById('rsvp-primary');
  const secondary = document.getElementById('rsvp-secondary');
  if (primary) primary.href = wa;
  if (secondary) {
    secondary.href = whatsappUrl(
      CONFIG.whatsapp.number,
      `Hi ${CONFIG.graduates.map((g) => g.name).join(', ')}! Congrats on graduating 🎓`
    );
  }

  preloadImages([
    ...CONFIG.graduates.map((g) => g.image),
    ...CONFIG.gallery.slice(0, 4).map((g) => g.src),
  ]);

  initCursor();

  await runIntro();
  revealPage();

  let lenis = null;
  if (!prefersReducedMotion()) {
    lenis = new Lenis({
      duration: mobile ? 1.05 : 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: mobile ? 1.6 : 1.2,
    });
  }

  initNavigation(lenis);

  let heroScene = null;
  let portraitScene = null;
  let sculptureScene = null;
  let finaleParticles = null;

  try {
    heroScene = createHeroScene(document.getElementById('hero-canvas'));
  } catch (e) {
    console.warn('Hero scene skipped:', e);
  }

  // Converging 3D portraits are desktop-only — mobile uses stacked layout
  if (!mobile) {
    try {
      portraitScene = await createPortraitScene(document.getElementById('space-canvas'));
    } catch (e) {
      console.warn('Portrait scene skipped:', e);
    }
  }

  try {
    sculptureScene = createSculptureScene(document.getElementById('sculpture-canvas'));
  } catch (e) {
    console.warn('Sculpture scene skipped:', e);
  }

  try {
    finaleParticles = createFinaleParticles(document.getElementById('finale-canvas'));
  } catch (e) {
    console.warn('Finale particles skipped:', e);
  }

  const anim = initAnimations({ lenis, portraitScene });
  window.addEventListener('load', () => anim.refresh());
  setTimeout(() => anim.refresh(), 600);

  window.__GRAD__ = { CONFIG, lenis, heroScene, portraitScene, sculptureScene, finaleParticles };
}

boot().catch((err) => {
  console.error('Graduation experience failed to boot:', err);
  revealPage();
});
