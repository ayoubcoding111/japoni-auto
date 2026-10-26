import { useEffect, useRef } from 'react';
import { siteHref, val } from '../data/site';
import { LINKS } from './Nav';
import { ext } from './ui';

function SiteItem({ k, fallback, hideEmpty }) {
  const v = val(k);
  if (!v && hideEmpty) return null;
  const href = v ? siteHref(k) : '';
  return <li><a href={href || '#visit'} {...(href && k === 'address' ? ext : {})}>{v || fallback}</a></li>;
}

const WORD = 'redline';
const RADIUS = 80;          // pointer influence (css px)
const GRAIN = 0.5;
const K = 0.14, DAMP = 0.8; // spring
const RING_MS = 900;

function hex(v, fb) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((v || '').trim());
  if (!m) return fb;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/* Halftone wordmark: the name drawn as a dot grid that springs away from the pointer and ripples on press. */
function useHalftone(rootRef, canvasRef, grainRef) {
  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!root || !ctx) return;

    const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cs = getComputedStyle(document.documentElement);
    const INK = hex(cs.getPropertyValue('--ink'), [242, 239, 233]);
    const WARM = hex(cs.getPropertyValue('--red'), [214, 0, 28]);
    const mix = (w) => 'rgb(' + INK.map((c, i) => Math.round(c + (WARM[i] - c) * w)).join(',') + ')';
    const INK_CSS = 'rgb(' + INK.join(',') + ')';

    /* grain overlay (tiled noise, sits under the text columns) */
    const t = document.createElement('canvas'); t.width = t.height = 128;
    const g = t.getContext('2d');
    if (g && grainRef.current) {
      const id = g.createImageData(128, 128);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = Math.random() * 255;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
      }
      g.putImageData(id, 0, 0);
      grainRef.current.style.cssText = 'position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;opacity:' + (GRAIN * 0.28) +
        ';background-image:url(' + t.toDataURL() + ');background-size:128px 128px;';
    }

    let W = 0, H = 0, dpr = 1, gap = 6;
    let dots = [];            // {x,y,r,ox,oy,vx,vy,w}
    const ptr = { x: -9999, y: -9999, on: false };
    let ring = null;          // {x,y,t}
    let running = false, visible = true, raf = 0, dead = false;

    function build() {
      W = Math.max(1, Math.round(root.clientWidth));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      gap = W < 600 ? 4 : 6;

      const m = document.createElement('canvas'); m.width = W; m.height = 8;
      const mc = m.getContext('2d', { willReadFrequently: true });
      if (!mc) return;
      const fam = '800 100px "Bricolage Grotesque", "Arial Black", system-ui, sans-serif';
      mc.font = fam;
      const w100 = mc.measureText(WORD).width || 1;
      const size = (W * 1.02) / w100 * 100;
      mc.font = fam.replace('100px', size + 'px');
      const tm = mc.measureText(WORD);
      const asc = tm.actualBoundingBoxAscent, desc = tm.actualBoundingBoxDescent;
      const gh = asc + desc;
      /* the stage is exactly as tall as the wordmark, so it never collides with the link columns */
      H = Math.ceil(gh * 1.04 + 4);
      canvas.style.height = H + 'px';
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      m.height = H;
      mc.font = fam.replace('100px', size + 'px');
      mc.textAlign = 'center'; mc.textBaseline = 'alphabetic';
      const baseline = H - desc - gh * 0.02;
      mc.fillStyle = '#fff';
      mc.fillText(WORD, W / 2, baseline);
      const data = mc.getImageData(0, 0, W, H).data;

      dots = [];
      const cols = Math.ceil(W / gap), rows = Math.ceil(H / gap);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          let sum = 0, n = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const px = Math.min(W - 1, Math.floor(i * gap + (sx + 0.5) * gap / 3));
              const py = Math.min(H - 1, Math.floor(j * gap + (sy + 0.5) * gap / 3));
              sum += data[(py * W + px) * 4 + 3]; n++;
            }
          }
          const cov = sum / (n * 255);
          if (cov > 0.04) dots.push({ x: i * gap + gap / 2, y: j * gap + gap / 2, r: Math.sqrt(cov) * gap * 0.56, ox: 0, oy: 0, vx: 0, vy: 0, w: 0 });
        }
      }
      draw(performance.now());
    }

    function step() {
      let moving = false;
      const pr = ptr.on ? RADIUS : 0;
      for (const d of dots) {
        let tx = 0, ty = 0;
        if (pr) {
          let dx = d.x - ptr.x, dy = d.y - ptr.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < pr) {
            const f = 1 - dist / pr, push = f * f * pr * 0.55;
            if (dist < 0.001) { dx = 1; dy = 0; dist = 1; }
            tx = dx / dist * push; ty = dy / dist * push;
          }
        }
        d.vx = (d.vx + K * (tx - d.ox)) * DAMP;
        d.vy = (d.vy + K * (ty - d.oy)) * DAMP;
        d.ox += d.vx; d.oy += d.vy;
        const mag = Math.sqrt(d.ox * d.ox + d.oy * d.oy);
        d.w = Math.min(1, mag / 28);
        if (mag > 0.05 || Math.abs(d.vx) > 0.02 || Math.abs(d.vy) > 0.02) moving = true;
        else { d.ox = d.oy = d.vx = d.vy = 0; d.w = 0; }
      }
      return moving || ptr.on || !!ring;
    }

    function draw(now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = INK_CSS;
      ctx.beginPath();
      for (const d of dots) {
        if (d.w >= 0.02) continue;
        const x = d.x + d.ox, y = d.y + d.oy;
        ctx.moveTo(x + d.r, y);
        ctx.arc(x, y, d.r, 0, 6.2832);
      }
      ctx.fill();
      for (const d of dots) {
        if (d.w < 0.02) continue;
        ctx.fillStyle = mix(d.w);
        ctx.beginPath();
        ctx.arc(d.x + d.ox, d.y + d.oy, d.r, 0, 6.2832);
        ctx.fill();
      }
      if (ring) {
        const p = (now - ring.t) / RING_MS;
        if (p >= 1) ring = null;
        else {
          const e = 1 - Math.pow(1 - p, 3);
          ctx.strokeStyle = 'rgba(' + WARM.join(',') + ',' + (0.55 * (1 - p)) + ')';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(ring.x, ring.y, 12 + e * 260, 0, 6.2832); ctx.stroke();
        }
      }
    }

    function frame(now) {
      raf = 0;
      const keep = step();
      draw(now);
      if (keep && visible && !dead) raf = requestAnimationFrame(frame); else running = false;
    }
    function wake() {
      if (reduced || running || !visible || dead) return;
      running = true; raf = requestAnimationFrame(frame);
    }
    function local(e) {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
    }

    const onMove = (e) => { ptr.on = true; local(e); wake(); };
    const onLeave = () => { ptr.on = false; wake(); };
    const onDown = (e) => {
      if (e.target.closest?.('a')) return;
      ptr.on = true; local(e);
      ring = { x: ptr.x, y: ptr.y, t: performance.now() };
      for (const d of dots) {
        const dx = d.x - ptr.x, dy = d.y - ptr.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 240 && dist > 0.001) { const f = 1 - dist / 240; d.vx += dx / dist * f * 12; d.vy += dy / dist * f * 12; }
      }
      wake();
    };
    const onUp = (e) => { if (e.pointerType !== 'mouse') { ptr.on = false; wake(); } };
    if (!reduced) {
      root.addEventListener('pointermove', onMove, { passive: true });
      root.addEventListener('pointerleave', onLeave, { passive: true });
      root.addEventListener('pointerdown', onDown, { passive: true });
      root.addEventListener('pointerup', onUp, { passive: true });
    }

    const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) wake(); }, { rootMargin: '100px' });
    io.observe(root);

    let lastW = 0, timer;
    const relayout = () => { if (dead) return; build(); lastW = root.clientWidth; };
    const ro = new ResizeObserver(() => {
      if (root.clientWidth === lastW) return;
      clearTimeout(timer); timer = setTimeout(relayout, 80);
    });
    ro.observe(root);

    relayout();
    document.fonts?.load?.('800 100px "Bricolage Grotesque"').then(relayout, () => {});
    document.fonts?.ready?.then(relayout);

    return () => {
      dead = true;
      cancelAnimationFrame(raf); clearTimeout(timer);
      io.disconnect(); ro.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerup', onUp);
    };
  }, [rootRef, canvasRef, grainRef]);
}

export default function Footer({ inert }) {
  const rootRef = useRef(null), canvasRef = useRef(null), grainRef = useRef(null);
  useHalftone(rootRef, canvasRef, grainRef);

  return (
    <footer
      className="hwf-root"
      ref={rootRef}
      inert={inert}
      style={{ '--hwf-bg': 'var(--bg)', '--hwf-ink': 'var(--ink)', '--hwf-mono': "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
    >
      <canvas aria-hidden="true" ref={canvasRef}></canvas>
      <div aria-hidden="true" ref={grainRef}></div>
      <span className="hwf-sr">Redline Motors</span>
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>Redline Motors</strong>
          <span>©{new Date().getFullYear()} · Car showroom</span>
        </div>
        <nav className="hwf-col" aria-label="Explore">
          <h3>Explore</h3>
          <ul>{LINKS.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </nav>
        <nav className="hwf-col" aria-label="What we do">
          <h3>What we do</h3>
          <ul>{['Sourcing', 'Inspection', 'Tuning', 'Delivery'].map((s) => <li key={s}><a href="#services">{s}</a></li>)}</ul>
        </nav>
        <nav className="hwf-col" aria-label="Contact">
          <h3>Contact</h3>
          <ul>
            <SiteItem k="phone" fallback="Send us a message" />
            <SiteItem k="address" fallback="Ask us for directions" />
            <SiteItem k="email" hideEmpty />
            <li><a href="#enquire">Enquire</a></li>
          </ul>
        </nav>
      </div>
      <div className="hwf-rule">
        <a className="hwf-up" href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
