import { Fragment } from 'react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Arrow = () => <svg {...icon}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowUp = () => <svg {...icon}><path d="M12 19V5M6 11l6-6 6 6" /></svg>;
export const Close = () => <svg {...icon}><path d="M6 6l12 12M18 6L6 18" /></svg>;

/* Pill button: the label rolls up and a red fill grows out of the arrow chip on hover.
   `mag` wraps it in the magnetic span; `wrap` passes attributes to that span. */
export function Btn({ as: Tag = 'a', label, className = '', mag = false, wrap, ...rest }) {
  const btn = (
    <Tag className={'btn ' + className} {...rest}>
      <span className="btn__txt"><span>{label}</span><span aria-hidden="true">{label}</span></span>
      <span className="btn__chip" aria-hidden="true"><Arrow /><Arrow /></span>
    </Tag>
  );
  return mag ? <span className="mag" {...wrap}>{btn}</span> : btn;
}

export function TLink({ as: Tag = 'a', children, icon: Icon = Arrow, ...rest }) {
  return <Tag className="tlink" {...rest}>{children}{Icon && <Icon />}</Tag>;
}

/* Words wrapped for the rise-in reveal; the parent carries the readable aria-label. */
export function Split({ text }) {
  return text.split(/\s+/).map((w, i) => (
    <Fragment key={i}>{i > 0 && ' '}<span className="w" aria-hidden="true"><span className="wi">{w}</span></span></Fragment>
  ));
}

export const ext = { target: '_blank', rel: 'noopener' };
