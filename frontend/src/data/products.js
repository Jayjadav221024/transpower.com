/* Hero carousel catalogue — drives the rotating product showcase. */
export const HERO_PRODUCTS = [
  {
    badge: '⚡ FRP Composite Products',
    accent: 'GRATINGS',
    rest: '& CABLE TRAYS',
    desc: 'Heavy-duty molded fiberglass mesh panels with superior chemical resistance, anti-slip grit top, and zero maintenance life — the backbone of industrial walkways.',
    pills: [
      { icon: '⚡', text: 'Non-Conductive / Electrically Insulating' },
      { icon: '🛡️', text: 'Corrosion & Chemical Resistant Surface' },
      { icon: '🔥', text: 'Fire Retardant Surface' },
    ],
    image: '/assets/images/hero_frp_grating.webp',
    imgAlt: 'Transpower FRP Molded Gratings & Cable Trays',
    model: 'Molded 38x38mm Mesh',
    resin: 'Isophthalic / Vinyl Ester',
  },
  {
    badge: '🔌 Cable Management Systems',
    accent: 'FRP CABLE',
    rest: 'TRAYS',
    desc: 'Non-conductive ladder and perforated trough cable management trays engineered for high-voltage power stations and marine offshore platforms.',
    pills: [
      { icon: '⚡', text: 'Zero Short-Circuit Risk' },
      { icon: '🌊', text: 'Saltwater Corrosion Resistant' },
      { icon: '☀️', text: 'UV Stabilised & Non-Sparking' },
    ],
    image: '/assets/images/cable_tray_product.webp',
    imgAlt: 'Transpower FRP Ladder Cable Trays',
    model: 'FRP Ladder Tray Series',
    resin: 'Vinyl Ester Composite',
  },
  {
    badge: '⚙️ Power Transmission Solutions',
    accent: 'INDUSTRIAL',
    rest: 'GEAR BOXES',
    desc: 'High-torque helical, bevel, and planetary gearmotors engineered for continuous heavy-duty drives, conveyors, and agitator systems at >96% efficiency.',
    pills: [
      { icon: '⚙️', text: 'Helical & Bevel-Helical Drives' },
      { icon: '📊', text: '>96% Power Transfer Efficiency' },
      { icon: '🏭', text: 'Cast Iron / Alloy Housing' },
    ],
    image: '/assets/images/gearboxes_product.webp',
    imgAlt: 'Transpower Industrial Gear Boxes',
    model: 'Helical Gearmotor Series',
    resin: 'ISO VG 220 Gear Oil',
  },
  {
    badge: '⚡ Power Distribution Systems',
    accent: 'SWITCHGEAR',
    rest: '& MCCs',
    desc: 'Industrial air circuit breakers, motor control centers, and power distribution panels tested for high short-circuit withstand capacity and plant electrical safety.',
    pills: [
      { icon: '🔒', text: 'High Short-Circuit Withstand' },
      { icon: '🏭', text: 'Motor Control Centers (MCC)' },
      { icon: '⚡', text: 'ACB & MCCB Full Range' },
    ],
    image: '/assets/images/switchgears_product.webp',
    imgAlt: 'Transpower Power Switchgears',
    model: 'ACB / MCCB Panel Series',
    resin: 'IEC 62271 Compliant',
  },
  {
    badge: '🏗️ Structural Composite Profiles',
    accent: 'PULTRUDED',
    rest: 'FRP PROFILES',
    desc: 'High-load composite I-beams, box channels, angles, and handrails replacing structural steel — 75% lighter with zero corrosion and zero painting required.',
    pills: [
      { icon: '🏋️', text: 'High Strength-to-Weight Ratio' },
      { icon: '🔧', text: 'Custom Cut to Length On-Site' },
      { icon: '♻️', text: 'Low Maintenance — No Painting Required' },
    ],
    image: '/assets/images/industrial_walkway.webp',
    imgAlt: 'Transpower Pultruded Structural FRP Profiles',
    model: 'Pultruded I-Beam / Box Series',
    resin: 'High-Modulus Glass Fibre',
  },
];

/* Product catalogue grid. */
export const PRODUCT_CARDS = [
  {
    id: 'cable-trays',
    category: 'cable-tray',
    badge: 'Top Seller',
    image: '/assets/images/cable_tray_product.webp',
    imgAlt: 'Transpower FRP Cable Trays',
    title: 'FRP Cable Trays',
    desc: 'Heavy-duty ladder, perforated, and trough composite cable management systems engineered with non-conductive UV-resistant fiberglass.',
    specs: [
      'Ladder & Perforated Channel types',
      'Dielectric - Zero short circuit risk',
      'Corrosion proof for chemical & marine environments',
    ],
    cta: 'Get Cable Tray Specs',
  },
  {
    id: 'gear-boxes',
    category: 'gearboxes',
    badge: 'New Line',
    image: '/assets/images/gearboxes_product.webp',
    imgAlt: 'Transpower Industrial Gear Boxes and Motors',
    title: 'Industrial Gear Boxes',
    desc: 'High-torque helical, bevel, worm, and planetary gearmotors designed for continuous heavy duty industrial drives and conveyors.',
    specs: [
      'Helical & Bevel-Helical Gear Drives',
      'High efficiency (> 96% output transfer)',
      'Rugged cast iron / alloy housing options',
    ],
    cta: 'Get Gearbox Catalog',
  },
  {
    id: 'switchgears',
    category: 'switchgears',
    badge: 'Power Systems',
    image: '/assets/images/switchgears_product.webp',
    imgAlt: 'Transpower Industrial Switchgears and Circuit Breakers',
    title: 'Power Switchgears',
    desc: 'Industrial circuit breakers, motor control centers (MCC), contactors, and power distribution switchgears for plant electrical safety.',
    specs: [
      'Air Circuit Breakers (ACB) & MCCB range',
      'Motor Control & Power Distribution Panels',
      'Tested for high short-circuit withstand capacity',
    ],
    cta: 'Get Switchgear Specs',
  },
  {
    id: 'molded-gratings',
    category: 'frp',
    badge: 'Structural',
    image: '/assets/images/hero_frp_grating.webp',
    imgAlt: 'Molded FRP Gratings',
    title: 'Molded FRP Gratings',
    desc: 'Bi-directional strength molded fiberglass mesh panels for chemical plant walkways, trench covers, and platform flooring.',
    specs: [
      'Standard 38x38mm & 50x50mm mesh',
      'Quartz grit top for permanent anti-slip friction',
      'Isophthalic & Vinyl Ester resin grades',
    ],
    cta: 'Get Grating Specs',
  },
  {
    id: 'electric-motors',
    category: 'motors',
    badge: 'Authorized Dealer',
    image: '/assets/images/gearboxes_product.webp',
    imgAlt: 'Transpower Industrial Electric Motors',
    title: 'Electric Motors',
    desc: 'Three-phase induction, flameproof and energy-efficient IE2/IE3 motors supplied as an authorised partner for Siemens, Crompton Greaves, Innomotics, Hindustan and Rotomotive.',
    specs: [
      'Squirrel cage & slip ring induction motors',
      'Flameproof and increased-safety Ex ratings',
      'IE2 / IE3 premium efficiency frames',
    ],
    cta: 'Get Motor Ratings',
  },
  {
    id: 'pultruded-profiles',
    category: 'frp',
    badge: 'Heavy Load',
    image: '/assets/images/industrial_walkway.webp',
    imgAlt: 'Pultruded FRP Structural Profiles',
    title: 'Pultruded Structural Profiles',
    desc: 'Composite I-Beams, Box Channels, Angles, Handrails, and custom structural sections replacing heavy traditional steel.',
    specs: [
      '75% lighter than structural steel',
      'High glass fiber stiffness matrix',
      'Zero ongoing painting or maintenance needed',
    ],
    cta: 'Request Structural Specs',
  },
];

export const PRODUCT_FILTERS = [
  { key: 'all',         label: 'All Products' },
  { key: 'frp',         label: 'FRP & Gratings' },
  { key: 'cable-tray',  label: 'FRP Cable Trays' },
  { key: 'gearboxes',   label: 'Gear Boxes' },
  { key: 'motors',      label: 'Motors' },
  { key: 'switchgears', label: 'Switchgears' },
];

/* FRP vs steel comparison matrix. */
export const COMPARISON_ROWS = [
  {
    feature: 'Corrosion Resistance',
    frp:  { text: 'Excellent – Chemically Inert to Acids, Alkalis & Solvents', tone: 'good' },
    galv: { text: 'Rusts over time', tone: 'bad' },
    ss:   { text: 'Good — resists most media', tone: 'good' },
  },
  {
    feature: 'Electrical Insulation',
    frp:  { text: 'Non-Conductive / Electrically Insulating', tone: 'good' },
    galv: { text: 'Highly Conductive', tone: 'bad' },
    ss:   { text: 'Highly Conductive', tone: 'bad' },
  },
  {
    feature: 'Weight Efficiency',
    frp:  { text: 'High Strength-to-Weight Ratio – Significantly Lighter than Steel', tone: 'good' },
    galv: { text: 'Very Heavy', tone: 'bad' },
    ss:   { text: 'Very Heavy', tone: 'bad' },
  },
  {
    feature: 'Maintenance Requirement',
    frp:  { text: 'Low Maintenance – No Painting or Galvanizing Required', tone: 'good' },
    galv: { text: 'Regular Painting / Galvanizing', tone: 'bad' },
    ss:   { text: 'Low — no coating required', tone: 'good' },
  },
  {
    feature: 'Slip Resistance',
    frp:  { text: 'Excellent – Meniscus & Grit top options', tone: 'good' },
    galv: { text: 'Poor – Slippery when wet', tone: 'bad' },
    ss:   { text: 'Moderate — requires serrated or chequered finish', tone: 'neutral' },
  },
  {
    feature: 'Installation Cost & Labour',
    frp:  { text: 'Low – Lightweight, easy to cut on site', tone: 'good' },
    galv: { text: 'High – Heavy, requires welding & hot work', tone: 'bad' },
    ss:   { text: 'High – Heavy, requires specialized welding', tone: 'bad' },
  },
  {
    feature: 'Impact Resistance',
    frp:  { text: 'High – Elastic recovery prevents permanent deformation', tone: 'good' },
    galv: { text: 'Moderate – Dents permanently under impact', tone: 'neutral' },
    ss:   { text: 'Moderate – Dents permanently under impact', tone: 'neutral' },
  },
  {
    feature: 'Service Life in Wet / Wastewater',
    frp:  { text: 'Excellent – Will not rot or rust in wet conditions', tone: 'good' },
    galv: { text: 'Poor – Rapid coating deterioration', tone: 'bad' },
    ss:   { text: 'Good, but subject to crevice corrosion', tone: 'neutral' },
  },
  {
    feature: 'Lifecycle Cost',
    frp:  { text: 'Low total cost of ownership', tone: 'good' },
    galv: { text: 'Low upfront, high recoating cost', tone: 'bad' },
    ss:   { text: 'Very high upfront cost', tone: 'bad' },
  },
];

/* Industrial application cards. */
export const APPLICATIONS = [
  {
    image: '/assets/images/industrial_walkway.webp',
    imgAlt: 'Chemical Processing Plant FRP Walkways',
    title: 'Chemical & Acid Plants',
    desc: 'Walkway platforms impervious to acid fumes and chemical spills.',
  },
  {
    image: '/assets/images/switchgears_product.webp',
    imgAlt: 'Power Sub-Stations Switchgears & Cable Trays',
    title: 'Power Sub-Stations',
    desc: 'Dielectric cable trays & switchgears eliminating ground fault risks.',
  },
  {
    image: '/assets/images/hero_frp_grating.webp',
    imgAlt: 'Water Treatment Plant Walkways',
    title: 'Water & Sewage Treatment',
    desc: 'Long-life deck gratings in high moisture zones.',
  },
  {
    image: '/assets/images/gearboxes_product.webp',
    imgAlt: 'Industrial Manufacturing Plants',
    title: 'Heavy Manufacturing & Mining',
    desc: 'Heavy duty gear drives & conveyor systems under continuous loads.',
  },
];

export const CERTIFICATIONS = [];

/* Load calculator profiles — EI in N·mm². */
export const MESH_PROFILES = [
  { key: '25mm-molded', label: '25 mm Molded FRP Grating (38x38 mesh)', EI: 3.4e9 },
  { key: '30mm-molded', label: '30 mm Molded FRP Grating (38x38 mesh)', EI: 6.7e9 },
  { key: '38mm-molded', label: '38 mm Molded FRP Grating (38x38 mesh)', EI: 1.1e10 },
];

export const RFQ_PRODUCTS = [
  { value: 'frp-gratings',       label: 'Molded FRP Gratings' },
  { value: 'cable-trays',        label: 'FRP Cable Trays' },
  { value: 'gearboxes',          label: 'Industrial Gear Boxes' },
  { value: 'electric-motors',    label: 'Electric Motors' },
  { value: 'switchgears',        label: 'Power Switchgears' },
  { value: 'pultruded-profiles', label: 'Pultruded Profiles & Beams' },
];
