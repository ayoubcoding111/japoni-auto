import { useRef } from 'react';
import { CARS, FIND_IT } from '../data/cars';
import { SplitHeading } from './Sections';
import { Btn, TLink } from './ui';

function Card({ car, onDetails, onEnquire }) {
  const detailsRef = useRef(null);
  const open = () => onDetails(car, detailsRef.current);
  return (
    <article className={'card' + (car.photo ? ' card--photo' : '')} data-car="">
      <div className="card__stage" onClick={open}>
        <img className="card__img" src={car.img} alt={car.alt} width="1600" height="1000" loading="lazy" />
      </div>
      <div className="card__info">
        <div>
          <p className="card__price">{car.tag}</p>
          <h3 className="card__name">{car.name}</h3>
          <p className="card__line">{car.line}</p>
        </div>
        <div className="card__side">
          <p className="card__price">{car.file?.Price || 'Price on request'}</p>
          <div className="card__links">
            <TLink as="button" type="button" ref={detailsRef} onClick={open}>Details</TLink>
            <TLink href="#enquire" onClick={() => onEnquire(car.name)}>Enquire</TLink>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Pinned horizontal gallery on large screens, a stacked list below 1024px. */
export default function Cars({ onDetails, onEnquire }) {
  return (
    <section className="cars" id="cars">
      <div className="wrap">
        <div className="cars__head">
          <div>
            <p className="eyebrow">Cars</p>
            <SplitHeading text="On the floor" style={{ marginTop: 24 }} />
          </div>
          <span className="cars__bar" aria-hidden="true"><span className="cars__fill"></span></span>
        </div>
      </div>
      <div className="cars__track">
        {CARS.map((car) => <Card key={car.name} car={car} onDetails={onDetails} onEnquire={onEnquire} />)}
        <article className="card card--cta">
          <div className="card__stage card__stage--cta">
            <h3 className="h3">Not on the floor? We will find it.</h3>
            <Btn mag href="#enquire" label="Tell us the car" onClick={() => onEnquire(FIND_IT)} />
          </div>
        </article>
      </div>
    </section>
  );
}
