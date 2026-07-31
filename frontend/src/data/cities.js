/* ==========================================================================
   City / service-area catalogue — drives the /locations SEO landing pages.

   Every product is manufactured at, and supplied from, the Makarpura (Vadodara)
   facility, so `products` below is the full range for every city. `focus` marks
   the lines that matter most to that city's dominant industry — it only changes
   the ordering and the on-page copy emphasis, never availability.

   NOTE FOR CONTENT REVIEW: `industries` and `areas` describe each city's
   well-known industrial estates. `distanceKm` is approximate road distance from
   the Vadodara plant. No delivery-time or on-site-stock promises are made
   anywhere in this file — add them only once commercially confirmed.
   ========================================================================== */

/* Product ids map to PRODUCT_CARDS in ./products.js and to /product/:id routes. */
export const ALL_PRODUCT_IDS = [
  'molded-gratings',
  'cable-trays',
  'pultruded-profiles',
  'gear-boxes',
  'switchgears',
];

export const CITIES = [
  {
    slug: 'vadodara',
    name: 'Vadodara',
    aka: 'Baroda',
    district: 'Vadodara',
    distanceKm: 0,
    isHeadOffice: true,
    lead: 'Vadodara is home to our manufacturing facility at 346 GIDC, Makarpura — every FRP grating, cable tray and gearbox we supply across Gujarat is produced here.',
    industries: [
      'Petrochemical & refinery complexes',
      'Power generation and transmission utilities',
      'Engineering and heavy fabrication units',
      'Pharmaceutical and specialty chemical plants',
    ],
    areas: ['Makarpura GIDC', 'Nandesari GIDC', 'Por-Ramangamdi', 'Savli GIDC', 'Halol', 'Waghodia'],
    focus: ['molded-gratings', 'cable-trays', 'switchgears'],
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    district: 'Ahmedabad',
    distanceKm: 110,
    lead: 'Ahmedabad’s pharmaceutical, textile-processing and engineering clusters run on corrosion-prone plant floors — exactly where non-conductive FRP replaces galvanised steel.',
    industries: [
      'Pharmaceutical and API manufacturing',
      'Textile processing and dyeing houses',
      'Engineering and machine-tool units',
      'Municipal water and sewage treatment',
    ],
    areas: ['Naroda GIDC', 'Odhav GIDC', 'Vatva GIDC', 'Changodar', 'Sanand', 'Narol'],
    focus: ['molded-gratings', 'gear-boxes', 'switchgears'],
  },
  {
    slug: 'anand',
    name: 'Anand',
    district: 'Anand',
    distanceKm: 40,
    lead: 'Anand’s dairy processing and agro-industrial plants demand hygienic, wash-down-resistant flooring and drives that survive constant moisture.',
    industries: [
      'Dairy and food processing',
      'Agro-chemical and fertiliser units',
      'Cold storage and material handling',
      'Effluent treatment plants',
    ],
    areas: ['Vitthal Udyognagar', 'Vallabh Vidyanagar GIDC', 'Karamsad', 'Borsad', 'Petlad'],
    focus: ['molded-gratings', 'gear-boxes', 'pultruded-profiles'],
  },
  {
    slug: 'ankleshwar',
    name: 'Ankleshwar',
    district: 'Bharuch',
    distanceKm: 75,
    lead: 'Ankleshwar GIDC is one of Asia’s largest chemical estates — acid fumes and solvent spills destroy mild steel walkways, which is why FRP gratings dominate here.',
    industries: [
      'Bulk drug and specialty chemical plants',
      'Dyes, pigments and intermediates',
      'Common effluent treatment plants (CETP)',
      'Agro-chemical formulation units',
    ],
    areas: ['Ankleshwar GIDC', 'Panoli GIDC', 'Jhagadia GIDC', 'Valia'],
    focus: ['molded-gratings', 'cable-trays', 'pultruded-profiles'],
  },
  {
    slug: 'bharuch',
    name: 'Bharuch',
    district: 'Bharuch',
    distanceKm: 70,
    lead: 'The Bharuch petrochemical belt runs high-voltage distribution through corrosive atmospheres, where dielectric cable trays remove ground-fault risk entirely.',
    industries: [
      'Petrochemical and fertiliser complexes',
      'Power distribution and substations',
      'Fibre, polymer and resin manufacturing',
      'Port and jetty infrastructure',
    ],
    areas: ['Dahej SEZ', 'Vilayat GIDC', 'Vagra', 'Amod', 'Zadeshwar'],
    focus: ['cable-trays', 'switchgears', 'molded-gratings'],
  },
  {
    slug: 'surat',
    name: 'Surat',
    district: 'Surat',
    distanceKm: 150,
    lead: 'Surat’s textile processing, dyeing and diamond units run continuous-duty drives and wet floors — a combination that punishes conventional steel and standard gearmotors.',
    industries: [
      'Textile processing, dyeing and printing',
      'Diamond and gems processing',
      'Chemical and intermediates manufacturing',
      'Hazira industrial and port zone',
    ],
    areas: ['Hazira', 'Sachin GIDC', 'Pandesara GIDC', 'Katargam', 'Palsana', 'Kim'],
    focus: ['gear-boxes', 'molded-gratings', 'switchgears'],
  },
  {
    slug: 'rajkot',
    name: 'Rajkot',
    district: 'Rajkot',
    distanceKm: 300,
    lead: 'Rajkot’s casting, forging and machine-tool cluster is one of Gujarat’s densest engineering markets, with heavy demand for high-torque drives and control panels.',
    industries: [
      'Casting, forging and foundry units',
      'Machine tools and auto components',
      'Submersible pump and motor manufacturing',
      'Bearing and engineering workshops',
    ],
    areas: ['Aji GIDC', 'Bhaktinagar GIDC', 'Shapar-Veraval', 'Metoda GIDC', 'Gondal Road'],
    focus: ['gear-boxes', 'switchgears', 'cable-trays'],
  },
  {
    slug: 'godhra',
    name: 'Godhra',
    district: 'Panchmahal',
    distanceKm: 75,
    lead: 'Godhra and the wider Panchmahal belt combine ceramics, quarrying and agro-processing — dusty, abrasive environments where zero-maintenance composites pay back fast.',
    industries: [
      'Ceramics and refractory units',
      'Stone quarrying and mineral processing',
      'Agro-processing and grain handling',
      'Rural power distribution networks',
    ],
    areas: ['Godhra GIDC', 'Halol GIDC', 'Kalol (Panchmahal)', 'Shehera', 'Lunawada Road'],
    focus: ['gear-boxes', 'molded-gratings', 'switchgears'],
  },
  {
    slug: 'navsari',
    name: 'Navsari',
    district: 'Navsari',
    distanceKm: 180,
    lead: 'Navsari mixes chemical estates with sugar and agro-processing, plus a coastal climate that accelerates corrosion on any exposed steel structure.',
    industries: [
      'Chemical and intermediates manufacturing',
      'Sugar and agro-processing mills',
      'Coastal and marine installations',
      'Water treatment and irrigation infrastructure',
    ],
    areas: ['Vijalpore GIDC', 'Jalalpore', 'Gandevi', 'Bilimora', 'Chikhli'],
    focus: ['molded-gratings', 'pultruded-profiles', 'cable-trays'],
  },
  {
    slug: 'vapi',
    name: 'Vapi',
    district: 'Valsad',
    distanceKm: 240,
    lead: 'Vapi GIDC concentrates dyes, pigments and bulk chemicals into one of India’s most aggressive industrial atmospheres — the toughest test any walkway material faces.',
    industries: [
      'Dyes, pigments and bulk chemicals',
      'Paper, pulp and packaging mills',
      'Common effluent treatment plants (CETP)',
      'Pharmaceutical intermediates',
    ],
    areas: ['Vapi GIDC', 'Sarigam GIDC', 'Umbergaon GIDC', 'Daman Road', 'Pardi'],
    focus: ['molded-gratings', 'cable-trays', 'pultruded-profiles'],
  },
  {
    slug: 'bhuj',
    name: 'Bhuj',
    district: 'Kutch',
    distanceKm: 450,
    lead: 'Kutch combines salt works, ports and large power generation with a saline coastal atmosphere — the single harshest corrosion environment in Gujarat.',
    industries: [
      'Salt works and marine chemicals',
      'Port, jetty and offshore infrastructure',
      'Thermal and renewable power generation',
      'Cement and mineral processing',
    ],
    areas: ['Bhuj GIDC', 'Anjar', 'Gandhidham', 'Mundra', 'Mandvi', 'Bhachau'],
    focus: ['cable-trays', 'molded-gratings', 'pultruded-profiles'],
  },
  {
    slug: 'amreli',
    name: 'Amreli',
    district: 'Amreli',
    distanceKm: 310,
    lead: 'Amreli’s agro-processing, cotton ginning and engineering workshops rely on continuous-duty drives and dependable distribution panels across dispersed rural sites.',
    industries: [
      'Cotton ginning and oil milling',
      'Agro-processing and cold storage',
      'Engineering and fabrication workshops',
      'Rural power and irrigation networks',
    ],
    areas: ['Amreli GIDC', 'Savarkundla', 'Babra', 'Lathi', 'Rajula', 'Jafrabad'],
    focus: ['gear-boxes', 'switchgears', 'molded-gratings'],
  },
  {
    slug: 'dahod',
    name: 'Dahod',
    district: 'Dahod',
    distanceKm: 150,
    lead: 'Dahod’s railway workshops, agro-industry and mineral units need corrosion-free structures and rugged transmission equipment built for continuous shift loads.',
    industries: [
      'Railway workshops and rolling stock',
      'Agro-processing and grain handling',
      'Mineral and stone processing',
      'Rural electrification infrastructure',
    ],
    areas: ['Dahod GIDC', 'Jhalod', 'Limkheda', 'Devgadh Baria', 'Garbada'],
    focus: ['gear-boxes', 'pultruded-profiles', 'switchgears'],
  },
];

export const getCityBySlug = (slug) =>
  CITIES.find((c) => c.slug === String(slug || '').toLowerCase()) || null;

/* Focus products first, then the remainder of the range. */
export const orderedProductIds = (city) => {
  const focus = city.focus.filter((id) => ALL_PRODUCT_IDS.includes(id));
  return [...focus, ...ALL_PRODUCT_IDS.filter((id) => !focus.includes(id))];
};

/* Three nearest other cities — used for internal linking between location pages. */
export const nearbyCities = (city, limit = 4) =>
  CITIES.filter((c) => c.slug !== city.slug)
    .map((c) => ({ ...c, gap: Math.abs(c.distanceKm - city.distanceKm) }))
    .sort((a, b) => a.gap - b.gap)
    .slice(0, limit);

/* FAQ blocks feed both the visible accordion and FAQPage structured data, so the
   answers must stay identical in both places. */
export const cityFaqs = (city, productTitles) => [
  {
    q: `Do you supply FRP gratings and cable trays in ${city.name}?`,
    a: `Yes. Transpower supplies its full range — ${productTitles.join(', ')} — to industrial clients across ${city.name} and the surrounding ${city.district} district, including ${city.areas.slice(0, 3).join(', ')}. All items are manufactured at our Makarpura, Vadodara facility.`,
  },
  {
    q: `Which industries in ${city.name} use Transpower products?`,
    a: `Our ${city.name} customers are concentrated in ${city.industries.slice(0, 3).join(', ').toLowerCase()}. These are environments where corrosion, chemical exposure or continuous mechanical load make composite and heavy-duty equipment the practical choice.`,
  },
  {
    q: `Why choose FRP over galvanised or stainless steel in ${city.name}?`,
    a: `FRP is 100% non-conductive, immune to acid and chemical attack, roughly 75% lighter than structural steel, and needs no repainting or galvanising over a 30+ year life. In ${city.name}'s ${city.industries[0].toLowerCase()} settings that removes both the corrosion replacement cycle and the electrical ground-fault risk.`,
  },
  {
    q: `Can I get a quotation for a site in ${city.name}?`,
    a: `Yes. Send your span, load and panel dimensions through the enquiry form on this page, or call +91 98255 07517. Quote your ${city.name} site location and we will size the profile and confirm pricing.`,
  },
  {
    q: `Are the products certified for industrial use?`,
    a: `Our FRP range is manufactured to ISO 9001:2015 quality management, carries an ASTM E84 Class 1 flame-spread rating, and is produced to ABS marine standards. Switchgear is built to IEC 62271 compliance.`,
  },
];
