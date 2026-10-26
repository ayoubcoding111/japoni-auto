import garage from '../assets/img/garage.webp';
import bmw from '../assets/img/car-bmw.webp';
import bmwOff from '../assets/img/car-bmw-off.webp';
import { CARS } from '../data/cars';
import { Btn, Split, TLink } from './ui';

const MARK = 'M130 70V290M130 70H240A70 70 0 0 1 240 210H130M220 210L310 290M470 290V70L570 200L670 70V290';
const TITLE = 'Elevate Your Drive to Extraordinary Heights';
const brands = new Intl.ListFormat('en-GB',{ type: 'conjunction' }).format([...new Set(CARS.map((c) => c.tag))].sort());

export default function Hero() {
  return (
    <section className="hero" aria-label="Redline Motors showroom">
      <div className="hero__bg"><img src={garage} alt="" width="1672" height="941" fetchPriority="high" /></div>

      <div className="hero__inner">
        <div className="hero__copy">
          <h1 aria-label={TITLE}><Split text={TITLE} /></h1>
          <div className="hero__cta">
            <Btn mag wrap={{ 'data-in': '' }} href="#cars" label="Explore the cars" />
          </div>
        </div>

        <div className="hero__stage">
          <div className="hero__floor"></div>
          <div className="hero__shadow"></div>
          <svg className="hero__mark" viewBox="0 0 800 340" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="markGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="340">
                <stop offset="0" stopColor="#555555" />
                <stop offset="1" stopColor="#161616" />
              </linearGradient>
            </defs>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path className="hero__mark-edge" strokeWidth="88" d={MARK} />
              <path stroke="url(#markGrad)" strokeWidth="78" d={MARK} />
            </g>
          </svg>
          <img className="hero__car" src={bmw} alt="Black BMW M3 seen from the front" width="1472" height="890" fetchPriority="high" />
          <img className="hero__car-off" src={bmwOff} alt="" aria-hidden="true" width="1472" height="890" fetchPriority="high" />
        </div>

        <div className="feat" data-in="">
          <small>On the floor</small>
          <p className="feat__name">{CARS.length} cars</p>
          <p className="feat__spec">{brands}</p>
          <TLink href="#cars">See the cars</TLink>
        </div>

        <span className="hero__side" aria-hidden="true">Showroom · Austin</span>

        <div className="hero__foot">
          <span className="cue" data-in=""><i aria-hidden="true"></i>Scroll</span>
        </div>
      </div>

      <div className="hero__dim"></div>
      <div className="hero__veil"></div>
      <div className="hero__vig"></div>

      <div className="loader" aria-hidden="true">
        <span>Warming up the showroom</span>
        <span className="loader__bar"><span className="loader__fill"></span></span>
        <span className="loader__pct">00%</span>
      </div>
    </section>
  );
}
