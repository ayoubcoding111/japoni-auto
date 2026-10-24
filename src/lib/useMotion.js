import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { animate, fine, scroller, splashGone } from './motion';

gsap.registerPlugin(ScrollTrigger);

const q = (s, c) => (c || document).querySelector(s);
const qa = (s, c) => Array.from((c || document).querySelectorAll(s));

/* All scroll and pointer motion for the page: smooth scrolling, the hero intro, reveals, the pinned car gallery,
   magnetic buttons and the custom cursor. Runs once after the page mounts; nothing here owns React state. */
export function useMotion() {
  useEffect(() => {
    if (!animate) return;
    const doc = document.documentElement;
    const offs = [], timers = [];
    const on = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); offs.push(() => el.removeEventListener(type, fn, opts)); };
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    let alive = true;

    /* phones resize the viewport when the address bar slides; don't re-measure everything mid-animation for that */
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: 'power3.out' });

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    scroller.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.stop();
    const release = () => { if (alive && !scroller.locks) lenis.start(); };

    let boost = 0, drift = null;
    const boostTick = () => { boost *= 0.92; if (drift) drift.timeScale(1 + boost); };
    gsap.ticker.add(boostTick);

    const ctx = gsap.context((self) => {
      /* Hero: loading (lights low, mark lifts from behind the car), then lights come up */
      const hero = q('.hero');
      const dim = q('.hero__dim'), veil = q('.hero__veil'), bgImg = q('.hero__bg img'), floor = q('.hero__floor');
      const mark = q('.hero__mark'), edge = q('.hero__mark-edge'), carOff = q('.hero__car-off');
      const words = qa('.hero h1 .wi'), ins = qa('.hero [data-in]');
      const loader = q('.loader'), pctEl = q('.loader__pct'), fill = q('.loader__fill');

      gsap.set(bgImg, { scale: 1.07 });
      gsap.set(mark, { yPercent: 70 });
      gsap.set(edge, { attr: { 'stroke-opacity': 0.55 } });
      gsap.set(words, { yPercent: 112, opacity: 1 });
      gsap.set(ins, { y: 18 });

      const prog = { v: 0 };
      const paint = () => {
        pctEl.textContent = String(Math.round(prog.v)).padStart(2, '0') + '%';
        fill.style.transform = 'scaleX(' + (prog.v / 100) + ')';
      };

      /* Headlights: the lights-off photo sits on top of the car. Showing it = lights off, hiding it = lights on.
         While loading the lights stutter on and off; lightsOn() hands over to a final flicker that settles lit. */
      const blink = (tl, at, pattern) => {
        let t = at;
        pattern.forEach(([lit, secs]) => { tl.set(carOff, { opacity: lit ? 0 : 1 }, t); t += secs; });
      };
      let loadFlicker = null;

      /* images and fonts start loading now, behind the splash; the showroom loader itself starts when the splash hands over */
      const decoded = Promise.all(qa('.hero img').map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())));
      /* wait for the display fonts too, so the headline never animates in a fallback font and then jumps when the real one swaps in */
      const fontsIn = document.fonts?.load
        ? Promise.all([document.fonts.load('500 48px "Bricolage Grotesque"'), document.fonts.load('400 16px "Instrument Sans"')]).catch(() => {})
        : Promise.resolve();

      const lightsOn = self.add('lightsOn', () => {
        if (!alive) return;
        loadFlicker.kill();
        const tl = gsap.timeline();
        blink(tl, 0.1, [[0, 0.15], [1, 0.07], [0, 0.1], [1, 0.1], [0, 0.06], [1, 0.2], [0, 0.28], [1, 0]]);
        tl.to(prog, { v: 100, duration: 0.3, ease: 'power1.out', onUpdate: paint }, 0)
          .to(loader, { autoAlpha: 0, duration: 0.3 }, 0.25)
          .to(dim, { keyframes: [
            { opacity: 0.8, duration: 0.2, ease: 'none' },
            { opacity: 0.5, duration: 0.06, ease: 'none' },
            { opacity: 0.8, duration: 0.06, ease: 'none' },
            { opacity: 0.6, duration: 0.15 },
            { opacity: 0.4, duration: 0.25 },
            { opacity: 0, duration: 1, ease: 'power2.out' },
          ] }, 0.1)
          .to(bgImg, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0.1)
          .to(floor, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0.3)
          .to(edge, { attr: { 'stroke-opacity': 0.3 }, duration: 1 }, 0.3)
          .to('#nav', { opacity: 1, duration: 0.6 }, 0.5)
          .to('.hero__side', { opacity: 1, duration: 0.8 }, 1.0)
          .to(words, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.6)
          .to(ins, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1 }, 1.0)
          .add(release, 2.0);
      });

      const startIntro = self.add('startIntro', () => {
        if (!alive) return;
        later(release, 7000);
        gsap.to(prog, { v: 92, duration: 1.3, ease: 'power2.out', onUpdate: paint });
        gsap.to(mark, { yPercent: 0, duration: 1.8, delay: 0.2, ease: 'power3.inOut' });
        loadFlicker = gsap.timeline({ repeat: -1, delay: 0.5 });
        blink(loadFlicker, 0, [[0, 0.7], [1, 0.07], [0, 0.18], [1, 0.12], [0, 0.55], [1, 0.05], [0, 0.1], [1, 0.22], [0, 0.9], [1, 0.1], [0, 0.35]]);
        const minWait = new Promise((r) => later(r, 1500));
        const cap = new Promise((r) => later(r, 4500));
        Promise.all([Promise.race([Promise.all([decoded, fontsIn]), cap]), minWait]).then(lightsOn);
      });
      splashGone.then(startIntro);

      /* Hero leaves with a slow parallax */
      gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
        .to('.hero__stage', { y: -70, ease: 'none' }, 0)
        .to('.hero__mark', { y: -90, ease: 'none' }, 0)
        .to('.hero__copy', { y: -90, ease: 'none' }, 0)
        .to(veil, { opacity: 0.75, ease: 'none' }, 0);

      /* Headings rise in word by word */
      qa('[data-split]').forEach((el) => {
        const wi = qa('.wi', el);
        gsap.set(wi, { yPercent: 112 });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => {
          gsap.to(wi, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07 });
        } });
      });

      /* Statement: words light up as you scroll */
      qa('[data-scrub]').forEach((el) => {
        gsap.fromTo(qa('.sw', el), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 } });
      });

      /* Generic reveals. Anything still below the fold is hidden up front, so text is never seen, blinks out, then animates back in. */
      const vh0 = window.innerHeight;
      qa('[data-r]').forEach((el) => { if (el.getBoundingClientRect().top > vh0 * 0.9) gsap.set(el, { autoAlpha: 0, y: 36 }); });
      const reveal = (b) => gsap.to(b, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true });
      ScrollTrigger.batch('[data-r]', { start: 'top 90%', once: true, onEnter: reveal, onLeave: reveal });

      /* Marquee: constant drift that speeds up with scroll velocity */
      drift = gsap.to('.marq__track', { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });
      lenis.on('scroll', (e) => { boost = Math.min(6, Math.abs(e.velocity) * 0.35); });

      /* Process rail */
      gsap.fromTo('.steps__fill', { scaleY: 0 }, { scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 62%', end: 'bottom 62%', scrub: true } });
      qa('.step').forEach((s) => {
        ScrollTrigger.create({ trigger: s, start: 'top 62%',
          onEnter: () => s.classList.add('is-active'),
          onLeaveBack: () => s.classList.remove('is-active') });
      });

      /* Visit backdrop drifts */
      gsap.fromTo('.visit__bg img', { yPercent: -7 }, { yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true } });

      /* Cars: pinned horizontal gallery on large screens */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const sec = q('.cars'), trackEl = q('.cars__track');
        const dist = () => Math.max(0, trackEl.scrollWidth - doc.clientWidth);
        const pan = gsap.to(trackEl, { x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, refreshPriority: 1, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (s) => gsap.set('.cars__fill', { scaleX: s.progress }) } });

        /* Each card arrives once: the photo is unmasked left to right while it settles from a slight zoom,
           then the name and links rise in behind it. Transform, opacity and clip-path only. */
        qa('.cars .card').forEach((card, i) => {
          const stage = q('.card__stage', card), img = q('.card__img', card), info = q('.card__info', card), cta = qa('.card__stage--cta > *', card);
          const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' },
            onComplete: () => gsap.set([stage, img, info].filter(Boolean), { clearProps: 'clipPath,transform,opacity,visibility' }) });
          gsap.set(stage, { clipPath: 'inset(0 100% 0 0 round 28px)' });
          if (img) gsap.set(img, { scale: 1.16 });
          if (info) gsap.set(info, { autoAlpha: 0, y: 22 });
          if (cta.length) gsap.set(cta, { autoAlpha: 0, y: 22 });
          tl.to(stage, { clipPath: 'inset(0 0% 0 0 round 28px)', duration: 1.15 }, 0);
          if (img) tl.to(img, { scale: 1, duration: 1.5 }, 0);
          if (cta.length) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.35);
          if (info) tl.to(info, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.5);
          ScrollTrigger.create(i === 0
            ? { trigger: sec, start: 'top 55%', once: true, onEnter: () => tl.play() }
            : { trigger: card, containerAnimation: pan, start: 'left 88%', once: true, onEnter: () => tl.play() });
        });
      });

      /* Small screens: cards stack, so they simply rise in one after another */
      mm.add('(max-width: 1023px)', () => {
        ScrollTrigger.batch('.cars .card', { start: 'top 88%', once: true,
          onEnter: (b) => gsap.fromTo(b, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true, clearProps: 'transform,opacity,visibility' }) });
      });

      /* Pointer-driven details (fine pointers only) */
      if (fine) {
        /* Car tilt + light, for transparent cut-outs (cards without photo: true) */
        qa('.card__stage').forEach((st) => {
          const img = q('.card__img', st);
          if (!img || st.closest('.card--photo')) return;
          gsap.set(img, { transformPerspective: 900 });
          const rY = gsap.quickTo(img, 'rotationY', { duration: 0.9, ease: 'power3' });
          const rX = gsap.quickTo(img, 'rotationX', { duration: 0.9, ease: 'power3' });
          const tX = gsap.quickTo(img, 'x', { duration: 0.9, ease: 'power3' });
          on(st, 'pointermove', (e) => {
            const r = st.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
            rY(px * 9); rX(-py * 6); tX(px * 16);
            st.style.setProperty('--mx', (px + 0.5) * 100 + '%');
            st.style.setProperty('--my', (py + 0.5) * 100 + '%');
          });
          on(st, 'pointerleave', () => { rY(0); rX(0); tX(0); });
        });

        /* Hero depth: car and mark drift against each other with the pointer. Decorative, so springs. */
        const depthCars = qa('.hero__car, .hero__car-off');
        const carQ = depthCars.map((el) => gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }));
        const markQ = gsap.quickTo(mark, 'x', { duration: 1.5, ease: 'power3' });
        const depth = (px) => { carQ.forEach((f) => f(px * -26)); markQ(px * -10); };
        on(hero, 'pointermove', (e) => {
          const r = hero.getBoundingClientRect();
          depth((e.clientX - r.left) / r.width - 0.5);
        });
        on(hero, 'pointerleave', () => depth(0));
        on(window, 'blur', () => depth(0));

        /* Magnetic buttons */
        qa('.mag').forEach((m) => {
          const xT = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' });
          const yT = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' });
          on(m, 'pointermove', (e) => {
            const r = m.getBoundingClientRect();
            xT((e.clientX - (r.left + r.width / 2)) * 0.25);
            yT((e.clientY - (r.top + r.height / 2)) * 0.35);
          });
          on(m, 'pointerleave', () => gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: true }));
        });

        /* Cursor: a point inside a ring, the system arrow is hidden */
        const cur = q('.cur'), dot = q('.cur-dot');
        doc.classList.add('has-cur');
        const cx = gsap.quickTo(cur, 'x', { duration: 0.4, ease: 'power3' });
        const cy = gsap.quickTo(cur, 'y', { duration: 0.4, ease: 'power3' });
        on(window, 'pointermove', (e) => {
          cur.classList.add('is-on'); dot.classList.add('is-on');
          cx(e.clientX); cy(e.clientY);
          dot.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
          const hot = !!e.target.closest?.('a, button, .mag, input, select, textarea, label');
          cur.classList.toggle('is-hot', hot); dot.classList.toggle('is-hot', hot);
        }, { passive: true });
        on(doc, 'mouseleave', () => { cur.classList.remove('is-on'); dot.classList.remove('is-on'); });
      }

      offs.push(() => mm.revert());
    });

    /* Measurements change once fonts and images are in */
    const refresh = () => alive && ScrollTrigger.refresh();
    on(window, 'load', refresh);
    document.fonts?.ready?.then(refresh);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      offs.forEach((off) => off());
      ctx.revert();
      gsap.ticker.remove(raf);
      gsap.ticker.remove(boostTick);
      lenis.destroy();
      scroller.lenis = null;
      doc.classList.remove('has-cur');
    };
  }, []);
}
