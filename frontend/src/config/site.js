/* Single source of truth for absolute URLs used in canonical tags, Open Graph
   metadata, JSON-LD and the sitemap. Kept here so the domain is changed once. */
export const SITE_ORIGIN = 'https://www.transpower.net.in';

export const SITE_NAME = 'Transpower Technologies Pvt. Ltd.';

export const COMPANY_EXPERIENCE_YEARS = '60+'; // Flagged for client sign-off (60+ years group history)

/* Head office / manufacturing address — used for LocalBusiness structured data. */
export const HEAD_OFFICE = {
  street: '346 GIDC, Makarpura',
  city: 'Vadodara',
  region: 'Gujarat',
  postalCode: '390010',
  country: 'IN',
  phone: '+91-98255-07517',
  email: 'baroda@transpower.net.in',
};

export const absoluteUrl = (path = '/') =>
  `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
