import { useEffect, useRef, useState } from 'react';
import garage from '../assets/img/garage.webp';
import { ENQUIRY_CARS } from '../data/cars';
import { digits, siteHref, val, waHref } from '../data/site';
import { refreshTriggers } from '../lib/motion';
import { SplitHeading } from './Sections';
import { ArrowUp, Btn, ext, TLink } from './ui';

function SiteValue({ k, fallback }) {
  const v = val(k), href = siteHref(k);
  if (!v) return <dd>{fallback}</dd>;
  return <dd>{href ? <a className="site-link" href={href} {...(k === 'address' ? ext : {})}>{v}</a> : v}</dd>;
}

function copyText(text) {
  function legacy() {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { /* not allowed */ }
    document.body.removeChild(ta); return ok;
  }
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text).then(() => true, () => legacy());
  return Promise.resolve(legacy());
}

/* The enquiry never leaves the browser: it is written up as a message the visitor sends on WhatsApp or by email. */
function Enquiry({ car, onCarChange, carHit }) {
  const [f, setF] = useState({ name: '', phone: '', budget: '', note: '' });
  const [errs, setErrs] = useState({ name: '', phone: '' });
  const [sent, setSent] = useState(null); // { first, name, message } once submitted
  const [ok, setOk] = useState('');
  const nameRef = useRef(null), phoneRef = useRef(null), doneRef = useRef(null), titleRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    refreshTriggers();
    if (sent) {
      titleRef.current.focus({ preventScroll: true });
      doneRef.current.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    } else {
      nameRef.current.focus({ preventScroll: true });
    }
  }, [sent]);

  const set = (k) => (e) => {
    const v = e.target.value;
    setF((p) => ({ ...p, [k]: v }));
    if (k === 'name' && v.trim().length > 1) setErrs((p) => ({ ...p, name: '' }));
    if (k === 'phone' && digits(v).length > 5) setErrs((p) => ({ ...p, phone: '' }));
  };

  function submit(e) {
    e.preventDefault();
    const name = f.name.trim(), phone = f.phone.trim();
    const badName = name.length < 2, badPhone = digits(phone).length < 6;
    setErrs({
      name: badName ? 'Please tell us your name.' : '',
      phone: badPhone ? 'Please enter a phone number we can reach you on.' : '',
    });
    if (badName) { nameRef.current.focus(); return; }
    if (badPhone) { phoneRef.current.focus(); return; }
    const lines = ['New enquiry for Japoni Auto', '', 'Name: ' + name, 'Phone: ' + phone];
    if (car) lines.push('Car: ' + car);
    if (f.budget.trim()) lines.push('Budget: ' + f.budget.trim());
    if (f.note.trim()) lines.push('Message: ' + f.note.trim());
    setOk('');
    setSent({ name, first: name.split(/\s+/)[0], message: lines.join('\n') });
  }

  const wa = val('whatsapp'), mail = val('email');
  const copy = () => copyText(sent.message).then((done) => setOk(done ? 'Copied. Paste it into any chat or email.' : 'Could not copy automatically. Select the text above and copy it.'));

  return (
    <div className="enq" id="enquire">
      <div className="enq__intro" data-r="">
        <p className="eyebrow">Enquire</p>
        <h3 className="enq__title">Tell us the car.</h3>
        <p className="enq__lede">Name the model, your budget and when you need it. We come back with options, photos and a clear inspection report.</p>
        <div className="enq__quick">
          {wa && <Btn {...ext} href={waHref()} className="btn--sm btn--solid" label="Chat on WhatsApp" />}
          {val('phone') && <TLink href={siteHref('phone')}>Call us</TLink>}
          {mail && <TLink href={siteHref('email')}>Email us</TLink>}
        </div>
      </div>
      <div data-r="">
        <form className="enq__form" noValidate onSubmit={submit} hidden={!!sent}>
          <div className="enq__grid">
            <div className={'fld' + (errs.name ? ' is-bad' : '')}>
              <label htmlFor="fName">Name</label>
              <input id="fName" ref={nameRef} name="name" type="text" autoComplete="name" required aria-describedby="eName" aria-invalid={!!errs.name} value={f.name} onChange={set('name')} />
              <small className="err" id="eName">{errs.name}</small>
            </div>
            <div className={'fld' + (errs.phone ? ' is-bad' : '')}>
              <label htmlFor="fPhone">Phone or WhatsApp</label>
              <input id="fPhone" ref={phoneRef} name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-describedby="ePhone" aria-invalid={!!errs.phone} value={f.phone} onChange={set('phone')} />
              <small className="err" id="ePhone">{errs.phone}</small>
            </div>
            <div className={'fld' + (carHit ? ' is-hit' : '')}>
              <label htmlFor="fCar">Car <em>(optional)</em></label>
              <select id="fCar" name="car" value={car} onChange={(e) => onCarChange(e.target.value)}>
                <option value="">Choose a car</option>
                {ENQUIRY_CARS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="fld">
              <label htmlFor="fBudget">Budget <em>(optional)</em></label>
              <input id="fBudget" name="budget" type="text" autoComplete="off" placeholder="A number or a range" value={f.budget} onChange={set('budget')} />
            </div>
            <div className="fld fld--full">
              <label htmlFor="fNote">Message <em>(optional)</em></label>
              <textarea id="fNote" name="note" rows="4" placeholder="Colour, spec, timing, anything we should know" value={f.note} onChange={set('note')}></textarea>
            </div>
          </div>
          <div className="enq__foot">
            <p className="enq__note">Name and phone are required.</p>
            <Btn as="button" type="submit" className="btn--solid" label="Send enquiry" />
          </div>
        </form>
        <div className="enq__done" hidden={!sent} ref={doneRef}>
          <h3 tabIndex="-1" ref={titleRef}>{sent ? 'Thank you, ' + sent.first + '.' : 'Thank you.'}</h3>
          <p className="enq__lede">
            {(wa || mail)
              ? 'Your enquiry is ready. Send it the way you prefer and it opens with everything filled in.'
              : 'Your enquiry is ready. Copy it and send it to us.'}
          </p>
          <pre className="enq__msg">{sent?.message}</pre>
          {sent && (
            <div className="enq__acts">
              {wa && <Btn {...ext} href={waHref(sent.message)} className="btn--sm btn--solid" label="Send on WhatsApp" />}
              {mail && (
                <TLink href={'mailto:' + encodeURI(mail) + '?subject=' + encodeURIComponent('Enquiry from ' + sent.name) + '&body=' + encodeURIComponent(sent.message)}>
                  Send by email
                </TLink>
              )}
              {(wa || mail)
                ? <button className="tlink" type="button" onClick={copy}>Copy message</button>
                : <Btn as="button" type="button" className="btn--sm btn--solid" label="Copy message" onClick={copy} />}
              <button className="tlink" type="button" onClick={() => setSent(null)}>Edit enquiry</button>
            </div>
          )}
          <p className="enq__ok" role="status" aria-live="polite">{ok}</p>
        </div>
      </div>
    </div>
  );
}

export default function Visit(props) {
  return (
    <section className="visit" id="visit">
      <div className="visit__bg" aria-hidden="true"><img src={garage} alt="" width="1672" height="941" loading="lazy" /></div>
      <div className="wrap">
        <p className="eyebrow" data-r="">Visit</p>
        <SplitHeading className="visit__title" text="Come and see it in person." />
        <dl className="visit__grid">
          <div data-r=""><dt>Showroom</dt><SiteValue k="address" fallback="Ask us for directions" /></div>
          <div data-r=""><dt>Phone</dt><SiteValue k="phone" fallback="Send us a message" /></div>
          <div data-r=""><dt>Opening hours</dt><SiteValue k="hours" fallback="Book a visit below" /></div>
        </dl>

        <Enquiry {...props} />

        <div className="visit__actions" data-r="">
          <Btn mag href="#cars" className="btn--solid" label="See the cars" />
          <TLink href="#top" icon={ArrowUp}>Back to top</TLink>
        </div>
      </div>
    </section>
  );
}
