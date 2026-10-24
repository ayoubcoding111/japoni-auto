import { useEffect, useRef, useState } from 'react';
import { animate } from '../lib/motion';
import { Btn } from './ui';

export const LINKS = [['#services', 'Services'], ['#cars', 'Cars'], ['#process', 'Process'], ['#visit', 'Visit']];

/* Solid after the hero starts, hides on the way down and returns on the way up. */
export default function Nav({ menuOpen, onToggle, burgerRef, inert }) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRef = useRef(menuOpen);
  openRef.current = menuOpen;

  useEffect(() => {
    let lastY = 0, ticking = false;
    const update = () => {
      const y = window.scrollY || 0;
      setSolid(y > 40);
      if (animate && !openRef.current) {
        if (y > lastY && y > 420) setHidden(true);
        else if (y < lastY) setHidden(false);
      }
      lastY = y; ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={'nav' + (solid ? ' is-solid' : '') + (hidden ? ' is-hidden' : '')} id="nav" inert={inert}>
      <a className="brand" href="#top" aria-label="Japoni Auto, back to top"><span>Japoni Auto</span></a>
      <nav className="nav__links" aria-label="Primary">
        {LINKS.map(([href, label]) => <a key={href} className="nl" href={href}>{label}</a>)}
      </nav>
      <div className="nav__right">
        <Btn mag href="#visit" className="btn--sm btn--solid" label="Book a visit" />
        <button
          ref={burgerRef}
          id="burger"
          className="burger"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={onToggle}
        ><span></span><span></span></button>
      </div>
    </header>
  );
}

export function Menu({ open }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => ref.current?.querySelector('.menu__links a')?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className={'menu' + (open ? ' is-open' : '')} id="menu" inert={!open} ref={ref}>
      <nav className="menu__links" aria-label="Menu">
        {LINKS.map(([href, label], i) => <a key={href} href={href} style={{ '--i': i }}>{label}</a>)}
      </nav>
      <Btn mag href="#visit" className="btn--solid" label="Book a visit" />
    </div>
  );
}
