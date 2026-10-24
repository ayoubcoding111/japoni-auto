import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Motion is on unless the viewer has asked for reduced motion. */
export const animate = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
export const fine = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);

/* when the page started, so the splash can stay up for a minimum time */
export const splashStart = performance.now();
let splashDone;
export const splashGone = new Promise((res) => { splashDone = res; });
export const markSplashGone = () => splashDone();

/* Lenis lives here so menus and dialogs can pause it. `locks` counts open overlays. */
export const scroller = { lenis: null, locks: 0 };

export function lockScroll(on) {
  scroller.locks = Math.max(0, scroller.locks + (on ? 1 : -1));
  const lenis = scroller.lenis;
  if (lenis) { if (scroller.locks) lenis.stop(); else lenis.start(); }
  document.documentElement.style.overflow = (!lenis && scroller.locks) ? 'hidden' : '';
}

const easeOut = (x) => 1 - Math.pow(1 - x, 4);

export function scrollToEl(t) {
  if (!t) return;
  if (scroller.lenis) scroller.lenis.scrollTo(t, { duration: 1.5, easing: easeOut });
  else t.scrollIntoView({ behavior: 'auto' });
}

/* Scroll helper that also works while Lenis was just restarted */
export function goTo(sel) {
  const t = document.querySelector(sel);
  if (!t) return;
  if (scroller.lenis) scroller.lenis.scrollTo(t, { offset: -96, duration: 1.5, force: true, easing: easeOut });
  else t.scrollIntoView({ behavior: 'auto' });
}

export function refreshTriggers() { setTimeout(() => ScrollTrigger.refresh(), 60); }
