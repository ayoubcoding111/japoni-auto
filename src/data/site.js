/* Showroom details. Fill these in once; anything left empty falls back to a neutral line and its button stays hidden.
   whatsapp: international number, for example "+213 555 00 00 00". mapUrl: a Google Maps link to the showroom. */
export const SITE = {
  phone: '+213 551 23 23 46',
  whatsapp: '+213 551 23 23 46',
  email: 'contact@japoniauto.com',
  address: 'Showroom JAPONIAUTO, Alger, Algerie',
  hours: '',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Showroom+JAPONIAUTO+Alger+Algerie',
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
