import { useCallback, useEffect, useRef, useState } from 'react';
import { ENQUIRY_CARS } from './data/cars';
import { goTo, lockScroll, scrollToEl } from './lib/motion';
import { useMotion } from './lib/useMotion';
import Splash from './components/Splash';
import Nav, { Menu } from './components/Nav';
import Hero from './components/Hero';
import { Marquee, Process, Services, Statement } from './components/Sections';
import Cars from './components/Cars';
import Visit from './components/Visit';
import Footer from './components/Footer';
import CarDialog from './components/CarDialog';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dlg, setDlg] = useState({ open: false, car: null });
  const [enqCar, setEnqCar] = useState('');
  const [carHit, setCarHit] = useState(false);
  const burgerRef = useRef(null), openerRef = useRef(null), hitTimer = useRef(0);
  /* overlays pause scrolling the moment they change, not after the next render, so a scroll started in the same click still runs */
  const open = useRef({ menu: false, dlg: false });

  useMotion();

  const setMenu = useCallback((next) => {
    if (open.current.menu === next) return;
    open.current.menu = next;
    lockScroll(next);
    setMenuOpen(next);
  }, []);

  const openDlg = useCallback((car, opener) => {
    openerRef.current = opener || null;
    if (!open.current.dlg) { open.current.dlg = true; lockScroll(true); }
    setDlg({ open: true, car });
  }, []);

  const closeDlg = useCallback((restore = true) => {
    if (!open.current.dlg) return;
    open.current.dlg = false;
    lockScroll(false);
    setDlg((d) => ({ ...d, open: false }));
    if (restore && openerRef.current) openerRef.current.focus({ preventScroll: true });
  }, []);

  /* Picks a car in the enquiry form and flashes the field so the visitor sees it change */
  const pickCar = useCallback((name) => {
    if (!name || !ENQUIRY_CARS.includes(name)) return;
    setEnqCar(name);
    setCarHit(true);
    clearTimeout(hitTimer.current);
    hitTimer.current = setTimeout(() => setCarHit(false), 1800);
  }, []);

  const enquireFromDlg = useCallback((name) => {
    closeDlg(false);
    pickCar(name);
    setTimeout(() => goTo('#enquire'), 80);
  }, [closeDlg, pickCar]);

  /* In-page links scroll smoothly and close the menu */
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id === '#') { e.preventDefault(); return; }
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      setMenu(false);
      scrollToEl(t);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (open.current.menu) { setMenu(false); burgerRef.current?.focus(); }
      closeDlg();
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [setMenu, closeDlg]);

  return (
    <>
      <Splash />
      <Nav menuOpen={menuOpen} onToggle={() => setMenu(!open.current.menu)} burgerRef={burgerRef} inert={dlg.open} />
      <Menu open={menuOpen} />
      <main id="top" inert={dlg.open}>
        <Hero />
        <Marquee />
        <Statement />
        <Services />
        <Cars onDetails={openDlg} onEnquire={pickCar} />
        <Process />
        <Visit car={enqCar} onCarChange={setEnqCar} carHit={carHit} />
      </main>
      <Footer inert={dlg.open} />
      <CarDialog open={dlg.open} car={dlg.car} onClose={closeDlg} onEnquire={enquireFromDlg} />
      <div className="cur" aria-hidden="true"><i></i></div>
      <div className="cur-dot" aria-hidden="true"><i></i></div>
    </>
  );
}
