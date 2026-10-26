import { useEffect, useState } from 'react';
import { markSplashGone, splashStart } from '../lib/motion';

const MARK = 'M130 70V290M130 70H240A70 70 0 0 1 240 210H130M220 210L310 290M470 290V70L570 200L670 70V290';
const STROKES = [
  ['0.15s', 'M130 70V290'],
  ['0.3s', 'M130 70H240A70 70 0 0 1 240 210H130'],
  ['0.5s', 'M220 210L310 290'],
  ['0.65s', 'M470 290V70L570 200L670 70V290'],
];

/* The first screen: the mark draws itself, stays at least ~2s, then fades and hands over to the showroom loader. */
export default function Splash() {
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let t2;
    const t1 = setTimeout(() => {
      setOut(true);
      document.documentElement.classList.remove('splash-on');
      markSplashGone();
      t2 = setTimeout(() => setGone(true), 800);
    }, Math.max(0, splashStart + 2000 - performance.now()));
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;
  return (
    <div className={'splash' + (out ? ' is-out' : '')} aria-hidden="true">
      <svg className="splash__mark" viewBox="0 0 800 340" focusable="false">
        <g className="splash__fill" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d={MARK} /></g>
        <g className="splash__draw" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {STROKES.map(([d, path]) => <path key={d} pathLength="1" style={{ '--d': d }} d={path} />)}
        </g>
      </svg>
      <p className="splash__name">Redline Motors</p>
    </div>
  );
}
