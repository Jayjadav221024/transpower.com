/* ==========================================================================
   Gallery photos.

   Every entry is an editable slot. The `key` becomes a data-edit-key on the
   <img>, which is what the admin visual customiser targets — so replacing a
   photo is Admin ▸ Pages ▸ Edit Gallery ▸ click the image ▸ pick from Media.
   No code change, no redeploy.

   The caption and detail under each photo are editable the same way. They hang
   off the image key as `<key>_caption` and `<key>_detail`, so a photo and its
   title are always overridden together — put a new image in a slot, click its
   title, retype it, Save. Deriving the text keys from the image key (rather
   than storing them here) is what keeps the pairing impossible to break.

   Swapping a photo in the admin panel stores an override against its key; the
   `src` below stays as the fallback if an override is ever removed.

   The captions describe the photographs currently sitting in each slot — the
   office, team and stores shots uploaded through the panel — not the product
   renders still named in `src`. Replace a photo and its caption together, or
   the two drift apart again.

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
    alt: 'Transpower head office cabin in Makarpura GIDC, Vadodara',
    caption: 'Head Office',
    detail: 'Makarpura GIDC, Vadodara',
  },
  {
    key: 'galleryImage_2',
    category: 'facility',
    src: '/assets/images/hero_frp_grating.webp',
    alt: 'Transpower sales and support staff at their desks in the Vadodara office',
    caption: 'Sales & Support Desk',
    detail: 'Where enquiries and orders are handled',
  },
  {
    key: 'galleryImage_3',
    category: 'team',
    src: '/assets/images/cable_tray_product.webp',
    alt: 'Transpower engineers reviewing a customer requirement in the meeting room',
    caption: 'Technical Discussion',
    detail: 'Sizing an application with the team',
  },
  {
    key: 'galleryImage_4',
    category: 'team',
    src: '/assets/images/cabletray_ladder_3d.jpg',
    alt: 'Transpower team gathered around a laptop during a working session',
    caption: 'Team Huddle',
    detail: 'Working an enquiry together',
  },
  {
    key: 'galleryImage_5',
    category: 'team',
    src: '/assets/images/gearboxes_product.webp',
    alt: 'Transpower staff holding awards at a recognition ceremony',
    caption: 'Rewards & Recognition',
    detail: 'Celebrating the team’s milestones',
  },
  {
    key: 'galleryImage_6',
    category: 'team',
    src: '/assets/images/switchgears_product.webp',
    alt: 'Group photograph of the Transpower team',
    caption: 'The Transpower Team',
    detail: 'The people behind every order',
  },
  {
    key: 'galleryImage_7',
    category: 'facility',
    src: '/assets/images/grating_meniscus_3d.jpg',
    alt: 'Transpower spares counter with stock shelved behind it',
    caption: 'Spares Counter',
    detail: '10,000+ SKUs held ready',
  },
  {
    key: 'galleryImage_8',
    category: 'team',
    src: '/assets/images/grating_grit_3d.jpg',
    alt: 'Transpower knowledge session with a speaker addressing a seated audience',
    caption: 'Knowledge Session',
    detail: 'Product briefing for the team',
  },
  {
    key: 'galleryImage_9',
    category: 'facility',
    src: '/assets/images/motor_siemens_3d.png',
    alt: 'Transpower storekeeper picking stock from the warehouse racking',
    caption: 'Stores & Dispatch',
    detail: 'Picking stock against an order',
  },
  {
    key: 'galleryImage_10',
    category: 'facility',
    src: '/assets/images/switchgear_distribution_3d.png',
    alt: 'Warehouse racking stacked with boxed motors and switchgear',
    caption: 'Warehouse Racking',
    detail: 'Fast-moving lines kept on the shelf',
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
