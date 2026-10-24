import { useEffect, useRef } from 'react';
import { Btn, Close } from './ui';

function Rows({ rows }) {
  return rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>);
}

/* Car details. `car` stays set after closing so the panel does not empty out while it fades. */
export default function CarDialog({ open, car, onClose, onEnquire }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current.scrollTop = 0;
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
    return () => clearTimeout(t);
  }, [open, car]);

  const photo = !!car?.photo;
  const file = { Year: 'On request', Mileage: 'On request', Price: 'On request', ...car?.file };

  return (
    <div className={'dlg' + (open ? ' is-open' : '')} role="dialog" aria-modal="true" aria-labelledby="dlgName" inert={!open}>
      <div className="dlg__scrim" onClick={() => onClose()}></div>
      <div className={'dlg__panel' + (photo ? ' is-photo' : '')} data-lenis-prevent="" ref={panelRef}>
        <button className="dlg__x" type="button" aria-label="Close details" ref={closeRef} onClick={() => onClose()}><Close /></button>
        <div className={'dlg__stage' + (photo ? ' is-photo' : '')}>{car && <img src={car.img} alt={car.alt} />}</div>
        <div className="dlg__body">
          <p className="eyebrow">{car?.tag || 'On the floor'}</p>
          <h2 className="dlg__name" id="dlgName">{car?.name}</h2>
          <p className="dlg__blurb">{car?.blurb}</p>
          <dl className="dlg__specs">{car && <Rows rows={car.specs || []} />}</dl>
          <dl className="dlg__file"><Rows rows={Object.entries(file)} /></dl>
          <div className="dlg__actions">
            <Btn as="button" type="button" className="btn--solid btn--sm" label="Enquire about this car" onClick={() => onEnquire(car?.name)} />
            <button className="tlink" type="button" onClick={() => onClose()}>Back to the cars</button>
          </div>
        </div>
      </div>
    </div>
  );
}
