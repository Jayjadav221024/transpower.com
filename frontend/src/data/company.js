/* ==========================================================================
   Company-level content shared by the home page and the About page.
   Single source of truth so the two pages can never drift apart.
   ========================================================================== */

/* Headline figures shown in the hero stat strip. */
export const COMPANY_STATS = [
  { value: '60+',    label: 'Years Experience' },
  { value: '8000+',  label: 'Happy Customers' },
  { value: '99%',    label: 'Retention' },
  { value: '10000+', label: 'Stock Keeping Units' },
];

/* Brands Transpower is an authorised dealer / channel partner for. */
export const BRANDS = [
  { name: 'SIEMENS',                   logo: '/assets/images/brand_siemens.png' },
  { name: 'CROMPTON GREAVES',          logo: '/assets/images/brand_crompton.png' },
  { name: 'INNOMOTICS',                logo: '/assets/images/brand_innomotics.png' },
  { name: 'HINDUSTAN ELECTRIC MOTORS', logo: '/assets/images/brand_hindustan.png' },
  { name: 'ROTOMOTIVE',                logo: '/assets/images/brand_rotomotive.png' },
];

/* ── Reputed clients ──────────────────────────────────────────────────────
   TO POPULATE: drop each client logo into frontend/public/assets/images/ and
   add a { name, logo } row below. The section hides itself while this list is
   empty, so the home page stays clean until the real logos are supplied.
   Only add companies that have agreed to be named as clients. */
export const CLIENTS = [];

/* ── Testimonials ─────────────────────────────────────────────────────────
   Only genuine, attributable customer quotes belong here. The one below is
   the quote already published on the About page. Three more are expected —
   add them as { quote, author, company } rows once supplied. */
export const TESTIMONIALS = [
  {
    quote:
      'Transpower Technologies has been our reliable partner for sourcing Crompton Greaves induction motors. Their responsiveness to our queries and prompt delivery of products have helped us meet our project deadlines without any hassle.',
    author: 'Rakesh Gaveriya',
    company: 'Mech Tech Machine Pvt Ltd',
  },
];
