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
    resin: 'Fiberglass Reinforced Plastic',
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
    resin: 'Composite Material',
  },
  {
    badge: '⚙️ Power Transmission Solutions',
    accent: 'INDUSTRIAL',
    rest: 'GEAR BOXES',
    desc: 'High-torque helical, bevel, and planetary gearmotors engineered for continuous heavy-duty drives, conveyors, and agitator systems.',
    pills: [
      { icon: '⚙️', text: 'Helical & Bevel-Helical Drives' },
      { icon: '📊', text: 'Optimised Power Transmission' },
      { icon: '🏭', text: 'Cast Iron / Alloy Housing' },
    ],
    image: '/assets/images/gearboxes_product.webp',
    imgAlt: 'Transpower Industrial Gear Boxes',
    model: 'Helical Gearmotor Series',
    resin: 'Industrial Lubricated',
  },
  {
    badge: '⚡ Power Distribution Systems',
    accent: 'SWITCHGEAR',
    rest: '& MCCs',
    desc: 'Industrial air circuit breakers, motor control centers, and power distribution panels engineered for plant electrical safety.',
    pills: [
      { icon: '🔒', text: 'Reliable Circuit Protection' },
      { icon: '🏭', text: 'Motor Control Centers (MCC)' },
      { icon: '⚡', text: 'ACB & MCCB Full Range' },
    ],
    image: '/assets/images/switchgears_product.webp',
    imgAlt: 'Transpower Power Switchgears',
    model: 'ACB / MCCB Panel Series',
    resin: 'IEC Standards Compliant',
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
      'High-performance power transmission',
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
      'Standard industrial safety configurations',
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
      'Standard 38x38mm mesh size',
      'Quartz grit top for permanent anti-slip friction',
      'Available in 25mm, 30mm, and 38mm heights',
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
    desc: 'Three-phase induction and energy-efficient motors supplied as an authorised channel partner for Siemens, Crompton Greaves, Innomotics, Hindustan and Rotomotive.',
    specs: [
      'Three-phase induction motors',
      'Standard enclosure options',
      'High-performance industrial frames',
    ],
    cta: 'Get Motor Ratings',
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
    frp:  { text: 'High Strength-to-Weight Ratio – Lighter than Steel', tone: 'good' },
    galv: { text: 'Very Heavy', tone: 'bad' },
    ss:   { text: 'Very Heavy', tone: 'bad' },
  },
  {
    feature: 'Maintenance Requirement',
    frp:  { text: 'Low Maintenance – No Painting or Coating Required', tone: 'good' },
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

export const RFQ_PRODUCTS = [
  { value: 'frp-gratings',       label: 'Molded FRP Gratings' },
  { value: 'cable-trays',        label: 'FRP Cable Trays' },
  { value: 'gearboxes',          label: 'Industrial Gear Boxes' },
  { value: 'electric-motors',    label: 'Electric Motors' },
  { value: 'switchgears',        label: 'Power Switchgears' },
];
