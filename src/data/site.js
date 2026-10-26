/* Showroom details. Fill these in once; anything left empty falls back to a neutral line and its button stays hidden.
   whatsapp: international number, for example "+1 512 555 0100". mapUrl: a Google Maps link to the showroom. */
export const SITE = {
  phone: '+1 512 555 0142',
  whatsapp: '+1 512 555 0142',
  email: 'contact@redlinemotors.com',
  address: 'Redline Motors, Austin, Texas',
  hours: '',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Redline+Motors+Austin+Texas',
};

export function val(k) { return String(SITE[k] || '').trim(); }
export function digits(s) { return String(s).replace(/\D/g, ''); }

export function siteHref(k) {
  const v = val(k);
  if (!v) return '';
  if (k === 'phone') return 'tel:' + v.replace(/[^\d+]/g, '');
  if (k === 'email') return 'mailto:' + encodeURI(v);
  if (k === 'address') return val('mapUrl');
  return '';
}

export function waHref(text) {
  const n = digits(val('whatsapp'));
  return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
}
