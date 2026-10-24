import { Fragment } from 'react';
import { Arrow, Split } from './ui';

/* The quieter sections: marquee, statement, services and process. All static; motion is attached in useMotion. */

const MARQ = [['b', 'Sourcing'], ['span', 'Inspection'], ['b', 'Tuning'], ['span', 'Delivery']];

export function Marquee() {
  const item = (
    <div className="marq__item">
      {MARQ.map(([Tag, word]) => <Fragment key={word}><Tag>{word}</Tag><i></i></Fragment>)}
    </div>
  );
  return (
    <section className="marq" aria-label="Sourcing, inspection, tuning, delivery">
      <div className="marq__track" aria-hidden="true">{item}{item}</div>
    </section>
  );
}

const STATEMENT = 'We find the car you want, prepare it properly and put the keys in your hand. Japoni Auto is a showroom for people who care how a car drives.';

export function Statement() {
  return (
    <section className="stmt">
      <div className="wrap">
        <p className="eyebrow" data-r=""><span className="jp" lang="ja">自動車</span>The showroom</p>
        <p className="stmt__text" data-scrub="" aria-label={STATEMENT}>
          {STATEMENT.split(' ').map((w, i) => <Fragment key={i}>{i > 0 && ' '}<span className="sw" aria-hidden="true">{w}</span></Fragment>)}
        </p>
      </div>
    </section>
  );
}

const SERVICES = [
  ['Car sourcing', 'Tell us the model, spec and budget. We search until we find the right one.'],
  ['Inspection and preparation', 'Every car is checked and prepared before it reaches you, so what you see is what you drive.'],
  ['Tuning and upgrades', 'Intake, exhaust, suspension and software, chosen around how you drive.'],
  ['Delivery and paperwork', 'Registration, shipping and handover, handled from start to finish.'],
];

export function Services() {
  return (
    <section className="svc" id="services">
      <div className="wrap">
        <p className="eyebrow" data-r="">Services</p>
        <SplitHeading text="What we do for your car" style={{ marginTop: 24 }} />
        <ul className="svc__list">
          {SERVICES.map(([title, desc]) => (
            <li className="svc__row" data-r="" key={title}>
              <h3 className="svc__title">{title}</h3>
              <p className="svc__desc">{desc}</p>
              <span className="svc__go" aria-hidden="true"><Arrow /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  ['Tell us what you want', 'Model, colour, budget and timing.'],
  ['We search and inspect', 'You get photos and a clear report before anything is decided.'],
  ['Prepare and tune', 'Servicing, fixes and upgrades, agreed with you first.'],
  ['Handover', 'Paperwork done, car delivered, keys in your hand.'],
];

export function Process() {
  return (
    <section className="proc" id="process">
      <div className="wrap">
        <div className="proc__grid">
          <div className="proc__side">
            <p className="eyebrow" data-r="">Process</p>
            <SplitHeading text="From request to keys" />
            <p data-r="">Four steps, and you know where your car is at every one of them.</p>
          </div>
          <div className="steps">
            <span className="steps__rail" aria-hidden="true"><span className="steps__fill"></span></span>
            <ol className="steps__list">
              {STEPS.map(([title, desc], i) => (
                <li className="step" key={title}>
                  <small>Step {i + 1}</small>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SplitHeading({ as: Tag = 'h2', text, className = 'h2', ...rest }) {
  return <Tag className={className} data-split="" aria-label={text} {...rest}><Split text={text} /></Tag>;
}
