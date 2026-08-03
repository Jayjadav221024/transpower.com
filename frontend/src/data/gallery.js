/* ==========================================================================
   Gallery photos.

   Every entry is an editable slot. The `key` becomes a data-edit-key on the
   <img>, which is what the admin visual customiser targets — so replacing a
   photo is Admin ▸ Pages ▸ Edit Gallery ▸ click the image ▸ pick from Media.
   No code change, no redeploy.

   The `src` values below are placeholders drawn from images already in the
   build. Swapping one in the admin panel stores an override against its key;
   the placeholder stays as the fallback if an override is ever removed.

   To add a slot, append an entry with a NEW key. Never renumber existing keys
   — an override is bound to its key, so renumbering would move photos around.
   ========================================================================== */

export const GALLERY_CATEGORIES = [
  { id: 'all',        label: 'All Photos' },
  { id: 'facility',   label: 'Facility & Plant' },
  { id: 'products',   label: 'Products' },
  { id: 'projects',   label: 'Site Installations' },
  { id: 'team',       label: 'Team & Events' },
];

export const GALLERY_ITEMS = [
  {
    key: 'galleryImage_1',
    category: 'facility',
    src: '/assets/images/industrial_walkway.webp',
    alt: 'Transpower manufacturing facility walkway in Makarpura, Vadodara',
    caption: 'Manufacturing Facility',
    detail: 'Makarpura GIDC, Vadodara',
  },
  {
    key: 'galleryImage_2',
    category: 'products',
    src: '/assets/images/hero_frp_grating.webp',
    alt: 'Molded FRP gratings produced at the Transpower plant',
    caption: 'Molded FRP Gratings',
    detail: 'Anti-slip grit top, ASTM E84 rated',
  },
  {
    key: 'galleryImage_3',
    category: 'products',
    src: '/assets/images/cable_tray_product.webp',
    alt: 'FRP cable trays ready for dispatch',
    caption: 'FRP Cable Trays',
    detail: 'Ladder and perforated types',
  },
  {
    key: 'galleryImage_4',
    category: 'projects',
    src: '/assets/images/cabletray_ladder_3d.jpg',
    alt: 'Ladder type cable tray installed on a client site',
    caption: 'Cable Tray Installation',
    detail: 'Client site commissioning',
  },
  {
    key: 'galleryImage_5',
    category: 'products',
    src: '/assets/images/gearboxes_product.webp',
    alt: 'Industrial gear boxes in the Transpower inventory',
    caption: 'Industrial Gear Boxes',
    detail: 'Helical and worm series',
  },
  {
    key: 'galleryImage_6',
    category: 'products',
    src: '/assets/images/switchgears_product.webp',
    alt: 'Siemens switchgear panels supplied by Transpower',
    caption: 'Switchgear Panels',
    detail: 'Authorised Siemens distributor',
  },
  {
    key: 'galleryImage_7',
    category: 'facility',
    src: '/assets/images/grating_meniscus_3d.jpg',
    alt: 'Meniscus top FRP grating panels stacked in the warehouse',
    caption: 'Warehouse Stock',
    detail: '10,000+ SKUs held ready',
  },
  {
    key: 'galleryImage_8',
    category: 'projects',
    src: '/assets/images/grating_grit_3d.jpg',
    alt: 'Grit top FRP grating walkway on an industrial site',
    caption: 'Walkway Project',
    detail: 'Chemical plant platform',
  },
  {
    key: 'galleryImage_9',
    category: 'products',
    src: '/assets/images/motor_siemens_3d.png',
    alt: 'Siemens industrial electric motor',
    caption: 'Siemens Motors',
    detail: 'Innomotics range',
  },
  {
    key: 'galleryImage_10',
    category: 'facility',
    src: '/assets/images/switchgear_distribution_3d.png',
    alt: 'Low voltage power distribution assembly area',
    caption: 'Panel Assembly',
    detail: 'LV distribution build area',
  },
  {
    key: 'galleryImage_11',
    category: 'team',
    src: '/assets/images/hemant_patel.png',
    alt: 'Transpower leadership',
    caption: 'Our Leadership',
    detail: '60+ years of combined experience',
  },
  {
    key: 'galleryImage_12',
    category: 'team',
    src: '/assets/images/kiran_parekh.png',
    alt: 'Transpower leadership',
    caption: 'Our Leadership',
    detail: 'Driving quality since inception',
  },
];
