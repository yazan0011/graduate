import { CONFIG } from './config.js';

function pad(n) {
  return String(n).padStart(2, '0');
}

export function initCountdown() {
  const root = document.getElementById('countdown');
  if (!root) return;

  const target = new Date(CONFIG.event.datetime).getTime();
  const els = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]'),
  };

  let prev = {};

  const update = () => {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    const next = { days, hours, minutes, seconds };

    Object.keys(els).forEach((key) => {
      if (!els[key]) return;
      if (prev[key] !== next[key]) {
        els[key].textContent = pad(next[key]);
        els[key].animate(
          [
            { opacity: 0.35, transform: 'translateY(6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      }
    });

    prev = next;
  };

  update();
  setInterval(update, 1000);
}
