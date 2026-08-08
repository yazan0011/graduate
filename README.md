# Class of 2026 — Cinematic Graduation Invitation

An ultra-premium, single-link graduation experience for three friends. Built with HTML, CSS, JavaScript, Three.js, GSAP, ScrollTrigger, and Lenis.

## Run locally

**Do not open `index.html` directly** (file://). ES modules need a local server with the correct JavaScript MIME type.

Recommended:

```bash
python server.py
```

Then open **http://127.0.0.1:5173**

Alternatives:

```bash
npx serve .
```

## Customize

Edit **`js/config.js`** — all guest-facing content lives there:

| Key | Purpose |
| --- | --- |
| `graduates[]` | Names, fields, quotes, portrait images |
| `event` | Date, time, location, countdown target |
| `whatsapp.number` | Digits only with country code |
| `whatsapp.message` | Pre-filled RSVP text |
| `journey` | Timeline milestones |
| `gallery` | Memory photos + captions |
| `hero` / `finale` / `rsvp` | Copy |

Replace Unsplash URLs with your own photos for the final shareable link.

## Structure

```
index.html
css/styles.css
js/
  config.js          ← edit this
  main.js
  intro.js
  animations.js
  cursor.js
  …
  three/
    hero-scene.js
    portrait-scene.js
    sculpture-scene.js
    finale-particles.js
```

## Notes

- Respects `prefers-reduced-motion` (fades instead of heavy motion / WebGL).
- Mobile reduces particle counts and 3D complexity automatically.
- Custom cursor is disabled on touch devices.
