// locations.ts — Single source of truth for location page data.
// Groups central, south, saurashtra, north, and Kutch locations in Gujarat.

export interface FAQ {
  q: string;
  a: string;
}

export interface CityLocation {
  slug: string;
  name: string;
  district: string;
  state: "Gujarat";
  type: "office" | "service-area";
  address?: string;
  pincode?: string;
  phone: string[];
  email: string[];
  mapEmbedUrl?: string;
  gmbUrl?: string;
  servedIndustrialAreas: string[];
  keyIndustries: string[];
  productsServed: string[];
  deliveryTimeline: string;
  distanceFromVadodaraKm: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introParagraph: string; // Unique 120-180 words
  faqs: FAQ[]; // Minimum 4 unique FAQs
  region: "Central" | "South" | "Saurashtra" | "North" | "Kutch";
}

export const CITIES: CityLocation[] = [
  // ── CENTRAL GUJARAT ──────────────────────────────────────────────────────
  {
    slug: "vadodara",
    name: "Vadodara",
    district: "Vadodara",
    state: "Gujarat",
    type: "office",
    address: "346, Makarpura GIDC, Makarpura, Vadodara, Gujarat",
    pincode: "390010",
    phone: ["+91 98255 07527", "+91 98255 07517"],
    email: ["baroda@transpower.net.in"],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.656847844078!2d73.2003889!3d22.2530965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5e505555555%3A0xe5a3bb45f95fc74f!2s346%2C%20Makarpura%20GIDC%2C%20Makarpura%2C%20Vadodara%2C%20Gujarat%20390010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    servedIndustrialAreas: ["Makarpura GIDC", "Nandesari GIDC", "Por-Ramangamdi", "Savli GIDC", "Waghodia GIDC"],
    keyIndustries: ["Petrochemicals", "Heavy Engineering", "Power Distribution", "Specialty Chemicals"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "Same day dispatch / local pickup available",
    distanceFromVadodaraKm: 0,
    metaTitle: "FRP Gratings, Cable Trays & Motors Supplier Vadodara | Transpower",
    metaDescription: "Transpower Technologies is headquartered in Makarpura GIDC, Vadodara. We manufacture FRP gratings, cable trays, pultruded profiles and distribute switchgears, motors, and gearboxes.",
    h1: "FRP Products & Power Distribution Systems in Vadodara",
    introParagraph: "Vadodara serves as the main corporate headquarters and manufacturing base for Transpower Technologies. Operating from our central facility in the Makarpura GIDC industrial cluster, we cater to the engineering, chemical, and petrochemical plants across Nandesari, Savli, and Waghodia. Vadodara's heavy industrial utilities demand high-voltage insulation and zero short-circuit risks, which are perfectly met by our non-conductive FRP composite materials and power distribution solutions. Being located at the heart of Central Gujarat allows us to offer immediate dispatch, local site surveys, and factory-direct technical consultations for local engineering teams. We supply custom-molded grating meshes, dielectric ladder-type trays, pultruded angles, and authorized switchgears directly from our stock points to minimize downtime across the district's continuous-production plants.",
    faqs: [
      { q: "Can I collect custom grating orders directly from your Vadodara plant?", a: "Yes. Customers in Vadodara and surrounding GIDCs can schedule a warehouse pickup from our Makarpura facility once production is complete." },
      { q: "Do you offer on-site load testing or layout surveys in Vadodara?", a: "Yes. Our local engineering team can visit your plant in Savli, Nandesari, or Makarpura to perform site surveys and suggest structural FRP sizing." },
      { q: "What is the typical lead time for standard molded grating orders in Vadodara?", a: "Since our primary manufacturing facility is in Makarpura, standard sizes are dispatched immediately, while custom resin mixes require 7 to 10 working days." },
      { q: "Are your switchgears and electric motors fully authorized in Vadodara?", a: "Yes, we are the authorized channel partner for Siemens, Crompton Greaves, Hindustan, and Rotomotive, with full warranty support in Vadodara." }
    ],
    region: "Central"
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    district: "Ahmedabad",
    state: "Gujarat",
    type: "office",
    address: "39, Mahalaxmi Industrial Estate, Bombay Conductor Rd, Vatva, Ahmedabad, Gujarat",
    pincode: "382445",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.3082531061957!2d72.631899!3d22.957262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8f4ab5555555%3A0x8e8dbb064c5d5e5c!2sMahalaxmi%20Industrial%20Estate%2C%20Vatva%2C%20Ahmedabad%2C%20Gujarat%20382445!5e0!3m2!1sen!2sin!4v1700000000002!5m2!1sen!2sin",
    servedIndustrialAreas: ["Vatva GIDC", "Naroda GIDC", "Odhav GIDC", "Changodar Industrial Area", "Sanand GIDC", "Kathwada GIDC"],
    keyIndustries: ["Pharmaceuticals", "Textile Processing", "Heavy Engineering", "Municipal Water Treatment"],
    productsServed: ["molded-gratings", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "Next-day dispatch from Ahmedabad stock point",
    distanceFromVadodaraKm: 110,
    metaTitle: "Siemens Switchgear & FRP Grating Supplier Ahmedabad | Transpower",
    metaDescription: "Transpower Group office (Shreeraj Traders) in Vatva, Ahmedabad supplies Siemens switchgears, industrial motors, gearboxes, and chemical-proof molded FRP gratings.",
    h1: "Power Transmission & Structural FRP Solutions in Ahmedabad",
    introParagraph: "Ahmedabad is served directly by our group company, Shreeraj Traders, based in the Vatva industrial area. Ahmedabad's vast pharmaceutical API labs, textile printing units, and dyes industries operate under extremely corrosive environments where acid splash and chemical washdown occur daily. Standard galvanised steel walkways fail rapidly in these settings, necessitating the use of our high-quality chemical-resistant vinyl ester and isophthalic FRP molded gratings. From Vatva, Naroda, and Changodar, our sales engineers provide technical support for sizing power distribution switchgears and selecting Crompton Greaves or Siemens electric motors. Our Ahmedabad presence ensures that client requirements are handled locally, providing quick delivery and prompt support for structural profiles, cable management networks, and high-efficiency gearmotors.",
    faqs: [
      { q: "Do you maintain local stock of Siemens switchgear in Vatva, Ahmedabad?", a: "Yes. Our Ahmedabad group office (Shreeraj Traders) carries inventory of standard Siemens air circuit breakers, MCCBs, and motor contactors." },
      { q: "What is the delivery timeline for FRP gratings to Ahmedabad sites?", a: "Standard panels are dispatched within 24 to 48 hours directly from our Vatva warehouse or Makarpura factory." },
      { q: "Can we get custom cut-to-size FRP profiles delivered to Naroda or Changodar?", a: "Yes. We offer pre-fabrication and custom cutting services at our facility, delivering ready-to-install layouts to your site." },
      { q: "Is on-site technical approval available for municipal projects in Ahmedabad?", a: "Yes. We work closely with contractors on AMC and AUDA water treatment plants, providing complete drawing submissions and certifications." }
    ],
    region: "Central"
  },
  {
    slug: "anand",
    name: "Anand",
    district: "Anand",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Vitthal Udyognagar GIDC", "Vallabh Vidyanagar GIDC", "Karamsad", "Borsad", "Petlad"],
    keyIndustries: ["Dairy and Food Processing", "Glass Manufacturing", "Agro-Industries", "Packaging"],
    productsServed: ["molded-gratings", "gear-boxes", "pultruded-profiles", "electric-motors"],
    deliveryTimeline: "1-2 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 40,
    metaTitle: "FRP Walkways & Food-Grade Gearboxes in Anand | Transpower",
    metaDescription: "Supply & service coverage in Anand. Non-conductive FRP gratings and high-torque gearboxes dispatched from our Vadodara stock points.",
    h1: "Hygienic FRP Gratings & Industrial Gearmotors in Anand",
    introParagraph: "Anand's status as India's dairy capital makes hygiene, moisture resistance, and continuous uptime primary considerations for plant managers. We supply Vitthal Udyognagar and Vallabh Vidyanagar with non-slip, corrosion-resistant FRP molded gratings that withstand constant washdowns and aggressive cleaning agents. In food processing and sorting corridors, traditional metal grating accumulates rust and bacteria, whereas composite FRP remains completely inert and sanitary. We also supply premium electric motors and gearboxes for conveyor lines and mixers, shipped from our nearby Vadodara stocks. This is a supply and service coverage area, with quick response dispatch from our main office in Vadodara to ensure your packing and sorting systems operate without interruptions.",
    faqs: [
      { q: "How do you service Anand industrial areas?", a: "Anand is handled directly from our Vadodara headquarters (only 40km away). Dispatches are made via regular transport route runs daily." },
      { q: "Are your FRP gratings safe for food-processing plants in Anand?", a: "Yes. Our polyester and vinyl ester resins are non-toxic once cured and do not harbor bacterial growth, unlike corroded metal platforms." },
      { q: "What gearboxes do you recommend for dairy mixers in Anand?", a: "We supply Rotomotive ROBUS helical gearboxes and QUBO worm series pre-filled with synthetic oil for maintenance-free operations." },
      { q: "Can we get engineering drawing support for installations in Vitthal Udyognagar?", a: "Yes, our engineering team in Vadodara can prepare CAD files and approval sheets for your project layout." }
    ],
    region: "Central"
  },
  {
    slug: "godhra",
    name: "Godhra",
    district: "Panchmahal",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Godhra GIDC", "Kalol Industrial Area", "Lunawada Road Cluster", "Shehera GIDC"],
    keyIndustries: ["Mineral Processing", "Quartz & Stone Crushing", "Agro-processing", "Rural Power Distribution"],
    productsServed: ["gear-boxes", "molded-gratings", "pultruded-profiles", "switchgears"],
    deliveryTimeline: "2-3 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 75,
    metaTitle: "Industrial Gearboxes & FRP Profiles Godhra | Transpower",
    metaDescription: "FRP structural profiles and industrial gearboxes supplied to Godhra and Kalol. Dispatched from our Vadodara manufacturing facility.",
    h1: "Rugged Gear Drives & Composite Walkways in Godhra",
    introParagraph: "Godhra and the broader Panchmahal district are known for heavy quartz crushing, mineral processing, and stone quarrying. The extremely dusty and abrasive environments in these crushers punish conventional steel structural grids and standard gearbox enclosures. Transpower supplies high-durability composite structural beams, channels, and angles that require no painting and do not suffer from grit wear. Our heavy-duty Rotomotive helical and worm gear drives are selected for their dust-tight seals, preventing internal component failure. All shipments to Godhra, Kalol, and surrounding mining zones are dispatched from our main Vadodara stock points. We guarantee robust packaging and reliable logistics to prevent any handling damage to switchgears and electrical controls during transit.",
    faqs: [
      { q: "How are deliveries to Godhra GIDC handled?", a: "We route shipments directly from our Makarpura, Vadodara manufacturing plant via local logistics networks, arriving within 48 hours." },
      { q: "Can FRP gratings survive the high dust environment of Godhra stone crushers?", a: "Yes. FRP is highly impact-resistant and does not wear down from abrasive dust or chip, eliminating the regular painting required by steel." },
      { q: "Do you supply switchgear panels for stone crusher setups in Panchmahal?", a: "Yes. We assemble and distribute Siemens-powered MCC and distribution boards tailored for heavy start-up loads." },
      { q: "What is the MOQ for pultruded structural channels to Godhra?", a: "We support both small single-unit replacements and bulk layouts. Contact us with your span requirements to get custom pricing." }
    ],
    region: "Central"
  },
  {
    slug: "dahod",
    name: "Dahod",
    district: "Dahod",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Dahod GIDC", "Jhalod GIDC", "Limkheda Cluster", "Devgadh Baria"],
    keyIndustries: ["Railway Workshops", "Grain Processing", "Mineral Grinding", "Rural Infrastructure"],
    productsServed: ["gear-boxes", "pultruded-profiles", "switchgears", "cable-trays"],
    deliveryTimeline: "3-4 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 150,
    metaTitle: "FRP Cable Trays & Railway Workshop Supplies Dahod | Transpower",
    metaDescription: "Distributor of gearboxes and manufacturer of FRP profiles/cable trays serving Dahod. Dispatched from our Vadodara hub.",
    h1: "FRP Cable Trays & Heavy Duty Transmission in Dahod",
    introParagraph: "Dahod's industrial base is dominated by major railway engine workshops, agro-processing mills, and mineral grinding plants. These continuous-duty sectors rely on high-capacity electrical distribution and heavy machinery. We supply dielectric FRP cable trays and robust composite structural handrails to Dahod's railway facilities, ensuring zero short-circuit risks and safe working platforms. For the local agro and flour mills, our high-torque gearboxes and energy-efficient electric motors ensure continuous operation under dusty conditions. This is a supply and service coverage area, with all orders managed and dispatched from our Vadodara facility. We provide full technical coordination, dispatching material with verified test certificates to guarantee compliance with railway and industrial codes.",
    faqs: [
      { q: "What is the freight charge for shipping FRP products to Dahod?", a: "Freight is calculated based on volume and weight. We coordinate with local Dahod transport agencies to offer competitive rates." },
      { q: "Do you provide test certificates for railway-bound orders in Dahod?", a: "Yes. We provide complete material test reports, including flammability (ASTM E84) and mechanical strength certificates, with every dispatch." },
      { q: "Can we use pultruded box sections for structural work in Dahod workshops?", a: "Yes, our high-strength pultruded fiberglass profiles are designed as direct steel alternatives for high-corrosion zones." },
      { q: "Is site survey support available in Dahod?", a: "For large projects, our Vadodara engineering team can schedule a site visit to assist with layout drawings and measurement audits." }
    ],
    region: "Central"
  },
  {
    slug: "halol",
    name: "Halol",
    district: "Panchmahal",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Halol GIDC Phase 1-4", "Kanjari GIDC", "Tajpura Industrial Zone"],
    keyIndustries: ["Automotive OEM", "Heavy Electrical Manufacturing", "Plastics and Polymers", "Chemicals"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "1-2 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 45,
    metaTitle: "Automotive OEM FRP Products & Motors Halol | Transpower",
    metaDescription: "FRP gratings, cable trays, and premium electric motors supplied to Halol automotive clusters. Shipped from our Vadodara plant.",
    h1: "FRP Walkways, Cable Trays & Switchgear Systems in Halol",
    introParagraph: "Halol is one of Gujarat's premier automotive and heavy electrical manufacturing hubs, hosting multi-national car brands, plastic molders, and chemical formulation plants. The engineering precision required in these automotive assembly lines calls for top-tier power transmission drives and robust cable management. Transpower supplies Halol's engineering clusters with dielectric FRP cable trays to secure control wiring, along with molded composite gratings for chemical treatment areas. We are also a key channel partner supplying energy-efficient Crompton Greaves and Siemens electric motors to power local machinery. Halol is within our rapid service network; all material is shipped from our main Makarpura, Vadodara manufacturing plant, assuring overnight delivery for standard configurations and immediate engineering support.",
    faqs: [
      { q: "Do you offer daily dispatches to Halol GIDC?", a: "Yes. Because of Halol's close proximity to our Vadodara plant (45km), we run regular logistics dispatches every business day." },
      { q: "Can we source Siemens IE3 premium efficiency motors for Halol plants?", a: "Yes. We maintain extensive stocks of Siemens and CG IE3/IE4 motors in Vadodara for immediate dispatch to Halol." },
      { q: "Are your FRP gratings suitable for automotive paint shop environments in Halol?", a: "Yes, our vinyl ester gratings are highly resistant to solvent spills and paint chemical exposure, outlasting steel grids." },
      { q: "Can we request a site survey in Halol for battery storage room flooring?", a: "Yes. Our engineers can visit your site in Halol to take measurements and specify acid-resistant non-conductive floor grids." }
    ],
    region: "Central"
  },
  {
    slug: "nadiad",
    name: "Nadiad",
    district: "Kheda",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Kamla GIDC", "Nadiad Industrial Cluster", "Kheda GIDC"],
    keyIndustries: ["Agricultural Processing", "Paper Mills", "Heavy Machinery Components", "Food and Tobacco"],
    productsServed: ["molded-gratings", "gear-boxes", "electric-motors", "cable-trays"],
    deliveryTimeline: "2 days dispatched from Vadodara / Ahmedabad stock points",
    distanceFromVadodaraKm: 60,
    metaTitle: "Industrial Motors & FRP Gratings Nadiad | Transpower",
    metaDescription: "Supplier of industrial electric motors, gearboxes, and chemical-proof FRP gratings in Nadiad. Dispatched from Vadodara.",
    h1: "FRP Gratings & Mechanical Transmission in Nadiad",
    introParagraph: "Nadiad's industrial landscape in Kheda district features a mix of paper mills, agricultural machinery manufacturers, and food processing complexes. Paper mills operate under constant moisture and chemical vapor environments, which cause rapid rusting of metallic structures. We supply Nadiad with durable, non-corrosive molded FRP gratings and structural support profiles that require zero maintenance over a 30+ year lifespan. Our high-torque worm and helical gearboxes are widely used in local processing machinery and conveyor belts. All orders for Nadiad are fulfilled and dispatched from our nearby Vadodara or Ahmedabad group warehouses. We ensure prompt delivery, full transit safety, and complete technical documentation to support your plant's engineering standards.",
    faqs: [
      { q: "How are deliveries to Kamla GIDC, Nadiad managed?", a: "Deliveries are routed directly from our Vadodara factory or Ahmedabad stock points via local logistics networks, arriving within 24-48 hours." },
      { q: "Are your gearboxes suitable for paper mill conveyor drives in Nadiad?", a: "Yes, our Rotomotive gearboxes feature cast iron monobloc bodies built to handle the continuous vibration and moisture of paper mills." },
      { q: "What is the typical warranty on electric motors supplied to Nadiad?", a: "All Siemens and Crompton Greaves motors come with a standard 12-month manufacturer warranty, backed by our local service support." },
      { q: "Do you supply FRP cable trays for Nadiad packaging facilities?", a: "Yes, we supply custom-sized perforated and ladder-type trays to support heavy control wiring setups." }
    ],
    region: "Central"
  },

  // ── SOUTH GUJARAT ────────────────────────────────────────────────────────
  {
    slug: "ankleshwar",
    name: "Ankleshwar",
    district: "Bharuch",
    state: "Gujarat",
    type: "office",
    address: "B/5-6, Kewal Shopping Centre, Old N H No 8, GIDC, Ankleshwar, Gujarat",
    pincode: "393002",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.886071477755!2d73.003664!3d21.629393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0208fa5555555%3A0x6b8bc27c62c3d5ef!2sKewal%20Shopping%20Centre%2C%20GIDC%2C%20Ankleshwar%2C%20Gujarat%20393002!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin",
    servedIndustrialAreas: ["Ankleshwar GIDC", "Panoli GIDC", "Jhagadia GIDC", "Valia GIDC"],
    keyIndustries: ["Chemical & Specialty Chemicals", "Pharmaceutical APIs", "Paints & Pigments", "Effluent Treatment (CETP)"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "Same-day delivery from Ankleshwar group office stock point",
    distanceFromVadodaraKm: 75,
    metaTitle: "FRP Gratings & Cable Trays Ankleshwar | Transpower Office",
    metaDescription: "Transpower Group office (Techno Sales Agency) in Ankleshwar GIDC. We supply chemical-resistant FRP molded gratings, cable trays, and Siemens switchgear.",
    h1: "Chemical-Proof FRP Products & Industrial Drives in Ankleshwar",
    introParagraph: "Ankleshwar GIDC is one of Asia's largest chemical and pharmaceutical hubs, hosting thousands of bulk drug units, specialty chemical manufacturers, and paint plants. In these environments, acid fumes, solvent spills, and highly corrosive wastewater rapidly dissolve galvanized steel walkways and create massive electrical safety risks. Transpower operates a dedicated group office, Techno Sales Agency, in Ankleshwar to provide local sales, technical support, and immediate dispatches of high-performance vinyl ester FRP gratings and dielectric cable trays. Our composite products are specifically engineered to remain completely unaffected by chemical exposure, providing a permanent slip-resistant walkway solution for chemical tanks and CETP units. We also support local plants with authorized distribution of Siemens switchgear, Crompton Greaves flameproof motors, and Rotomotive gearboxes, directly backed by on-site technical assistance.",
    faqs: [
      { q: "Where is the Transpower office in Ankleshwar located?", a: "Our group office, Techno Sales Agency, is located at B/5-6, Kewal Shopping Centre, GIDC, Ankleshwar. You can visit us for technical inquiries." },
      { q: "Are your electric motors and switchgears rated for flameproof zones in Ankleshwar?", a: "Yes. We supply certified Ex-d flameproof Crompton Greaves and Siemens motors specifically rated for hazardous gas zones in chemical plants." },
      { q: "Can we buy chemical-proof vinyl ester FRP gratings directly in Ankleshwar?", a: "Yes. We maintain local stock and handle dispatch directly from our Ankleshwar group office to all units in Panoli, Jhagadia, and Ankleshwar." },
      { q: "Do you supply custom FRP handrails for chemical storage tank platforms?", a: "Yes, we design, supply, and deliver complete pultruded FRP safety handrails, ladders, and stairs customized for chemical tank fields." }
    ],
    region: "South"
  },
  {
    slug: "bharuch",
    name: "Bharuch",
    district: "Bharuch",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Narmada Nagar GIDC", "Bharuch Industrial Zone", "Vilayat GIDC", "Dahej SEZ"],
    keyIndustries: ["Petrochemical Complexes", "Chlor-Alkali Plants", "Textile Fibers", "Marine and Port Operations"],
    productsServed: ["cable-trays", "molded-gratings", "pultruded-profiles", "switchgears"],
    deliveryTimeline: "Next-day dispatch from Ankleshwar stock point",
    distanceFromVadodaraKm: 70,
    metaTitle: "FRP Cable Trays & Petrochemical Walkways Bharuch | Transpower",
    metaDescription: "FRP cable trays and molded chemical gratings served across Bharuch and Vilayat. Dispatched from Ankleshwar.",
    h1: "Dielectric FRP Cable Trays & Industrial Gratings in Bharuch",
    introParagraph: "Bharuch is a major petrochemical and polymer hub, surrounded by mega-scale chlor-alkali units and chemical processing zones. High-voltage power distribution runs through highly corrosive atmospheres in these large complexes, making dielectric protection a primary safety requirement. Transpower supplies specialized fiberglass-reinforced plastic (FRP) cable trays that eliminate short-circuit and ground-fault risks entirely. Our chemical-grade molded gratings are widely used for trench covers and plant walkways, replacing heavy steel grids that rust in low-pH environments. Bharuch is serviced directly from our group office in neighboring Ankleshwar (only 15km away), ensuring rapid next-day dispatches and immediate access to technical engineers for site measurements and project support.",
    faqs: [
      { q: "How are dispatches to Bharuch GIDCs handled?", a: "Dispatches are made daily from our Ankleshwar stock point, ensuring delivery to Bharuch or Narmadanagar within 24 hours." },
      { q: "Do your FRP cable trays comply with electrical safety standards in power stations?", a: "Yes, our FRP trays are completely non-conductive, self-extinguishing, and comply with international dielectric and fire safety codes." },
      { q: "What resin grade is recommended for the chlor-alkali units in Bharuch?", a: "We recommend our premium Vinyl Ester resin gratings, which offer the highest resistance to chlorine, caustic soda, and acid fumes." },
      { q: "Can you assist in designing custom cable tray layouts for Bharuch plants?", a: "Yes, our engineering team in Vadodara and sales team in Ankleshwar can assist with CAD drawings and tray load calculations." }
    ],
    region: "South"
  },
  {
    slug: "surat",
    name: "Surat",
    district: "Surat",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Sachin GIDC", "Pandesara GIDC", "Ichhapore GIDC", "Karanj Industrial Area", "Palsana Industrial Zone", "Kim GIDC"],
    keyIndustries: ["Textile Processing & Dyeing", "Diamond Cutting & Polishing", "Heavy Petrochemicals", "Textile Machinery"],
    productsServed: ["gear-boxes", "molded-gratings", "switchgears", "electric-motors"],
    deliveryTimeline: "Next-day dispatch from Ankleshwar stock point",
    distanceFromVadodaraKm: 150,
    metaTitle: "Textile Dyeing FRP Gratings & Gearboxes Surat | Transpower",
    metaDescription: "FRP gratings for wet dye plants and heavy industrial gearboxes supplied to Surat and Sachin. Dispatched from Ankleshwar.",
    h1: "FRP Flooring & Power Transmission Drives in Surat",
    introParagraph: "Surat's industrial base is dominated by massive textile processing, sizing, and dyeing complexes, alongside advanced diamond polishing units. Textile dyeing houses operate under constant high humidity, hot wastewater pools, and chemical coloring agents—conditions that rapidly corrode metallic structures and steel floor grids. Transpower supplies Surat's textile hubs in Sachin and Pandesara with heavy-duty anti-slip FRP molded gratings that withstand chemical exposure and wet floors without rusting or fading. We also distribute high-torque gearboxes and energy-efficient electric motors to power local textile machinery and continuous conveyor belts. All Surat orders are serviced and dispatched from our Ankleshwar group stock point, ensuring rapid transit, full warranty support, and prompt on-site engineering coordination.",
    faqs: [
      { q: "Why use FRP gratings in Surat's wet textile dyeing houses?", a: "FRP does not rust under constant moisture and chemical exposure, has a quartz-grit anti-slip top to prevent worker slips, and requires zero painting." },
      { q: "How fast can you deliver standard gearmotors to Sachin GIDC in Surat?", a: "Standard Rotomotive gearboxes and Siemens motors can be dispatched from our Ankleshwar stock point for next-day delivery." },
      { q: "Do you supply switchgear panels for diamond processing facilities in Surat?", a: "Yes. We distribute Siemens ACB and MCCB panels designed for clean, precise electrical safety in high-tech industrial environments." },
      { q: "What is the warranty support for products delivered to Surat?", a: "All products carry a full manufacturer's warranty, backed by local service coordinates from our nearby Ankleshwar office." }
    ],
    region: "South"
  },
  {
    slug: "navsari",
    name: "Navsari",
    district: "Navsari",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Vijalpore GIDC", "Jalalpore Industrial Estate", "Bilimora Industrial Zone", "Gandevi Cluster"],
    keyIndustries: ["Chemical Intermediates", "Sugar Processing Mills", "Coastal Marine & Aquaculture", "Textiles"],
    productsServed: ["molded-gratings", "pultruded-profiles", "cable-trays", "electric-motors"],
    deliveryTimeline: "2 days dispatched from Ankleshwar stock point",
    distanceFromVadodaraKm: 180,
    metaTitle: "Coastal FRP Gratings & Marine Products Navsari | Transpower",
    metaDescription: "Corrosion-proof marine FRP gratings and industrial motors served in Navsari. Dispatched from our Ankleshwar stock point.",
    h1: "Marine-Grade FRP Gratings & Heavy Motors in Navsari",
    introParagraph: "Navsari combines chemical intermediate manufacturing with large sugar processing mills, alongside a coastal geography that exposes industrial equipment to highly saline air. Saline coastal environments cause rapid electrochemical corrosion on steel structures, making marine-grade composite materials essential. Transpower supplies Navsari with UV-stabilized molded FRP gratings and pultruded composite structures that are completely immune to saltwater and chemical decay. We also supply heavy-duty electric motors designed to withstand high moisture and outdoor conditions in sugar mills and coastal facilities. Orders are fulfilled through our group stock points in Ankleshwar, ensuring reliable freight delivery, certified product performance, and prompt technical support for Navsari's growing manufacturing clusters.",
    faqs: [
      { q: "Can FRP profiles handle the saline coastal weather in Navsari?", a: "Yes. Our composite profiles are UV-stabilized and completely immune to saltwater corrosion, making them ideal for coastal and marine setups." },
      { q: "Do you supply motors for sugar mill agitators in Navsari?", a: "Yes. We supply Crompton Greaves and Siemens heavy-duty electric motors with IP55 protection ratings suitable for sugar plant environments." },
      { q: "What is the typical delivery schedule to Bilimora, Navsari?", a: "Orders are processed at our Ankleshwar hub and arrive at Navsari sites within 48 hours of dispatch." },
      { q: "Are your FRP products certified for marine use?", a: "Yes, our marine-grade fiberglass composite range is manufactured to comply with international ABS marine standards." }
    ],
    region: "South"
  },
  {
    slug: "vapi",
    name: "Vapi",
    district: "Valsad",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Vapi GIDC (1st-4th Phase)", "Sarigam GIDC", "Umbergaon GIDC", "Daman Road Cluster", "Pardi GIDC"],
    keyIndustries: ["Chemicals & Dyes", "Paper and Pulp Mills", "Common Effluent Treatment (CETP)", "Pharmaceuticals"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "2 days dispatched from Ankleshwar / Vadodara stock points",
    distanceFromVadodaraKm: 240,
    metaTitle: "Paper Mill FRP Gratings & Cable Trays Vapi | Transpower",
    metaDescription: "FRP molded gratings and perforated cable trays supplied to Vapi and Sarigam GIDC. Managed via Ankleshwar stock point.",
    h1: "Acid-Proof FRP Flooring & Power Distribution in Vapi",
    introParagraph: "Vapi GIDC is one of Western India's most intensive chemical belts, containing massive concentrations of dye factories, paper mills, and pharma intermediate units. The chemical processing corridors and wastewater treatment systems in Vapi release highly aggressive acidic vapors that destroy traditional carbon steel structures in months. Transpower supplies Vapi and nearby Sarigam GIDC with high-performance vinyl ester composite gratings, fiberglass structural beams, and perforated cable trays. These products do not corrode, require zero repainting, and provide permanent slip resistance, significantly lowering plant maintenance costs. We also supply heavy-duty gearboxes and electric motors to handle the heavy, wet slurry loads of Vapi's paper and pulp processing plants, with all dispatches efficiently coordinated through our Ankleshwar operations.",
    faqs: [
      { q: "How do you service Vapi and Sarigam GIDC?", a: "We manage Vapi sales and technical support from our group office in Ankleshwar, shipping material via regular daily freight lines." },
      { q: "Which chemical resistance grade should we buy for Vapi paper mills?", a: "We recommend our Vinyl Ester resin grating, which offers superior resistance to bleach, acidic vapor, and chemical sludge." },
      { q: "Do you supply switchgears for industrial expansion projects in Umbergaon?", a: "Yes, we supply authorized Siemens air circuit breakers, MCCBs, and custom power distribution panels." },
      { q: "Can we get sample pieces of your FRP grating in Vapi?", a: "Yes. Contact our sales engineer via WhatsApp, and we can deliver sample blocks and technical catalogs to your site." }
    ],
    region: "South"
  },
  {
    slug: "dahej",
    name: "Dahej",
    district: "Bharuch",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Dahej SEZ Part 1 & 2", "Jhagadia Industrial Estate", "Vilayat Industrial Zone"],
    keyIndustries: ["Chemicals and Specialty Chemicals", "Mega Petrochemical Complexes", "Fertilizers", "Ports & Marine Terminals"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "Next-day dispatch from Ankleshwar stock point",
    distanceFromVadodaraKm: 110,
    metaTitle: "Petrochemical FRP Gratings & Cable Trays Dahej | Transpower",
    metaDescription: "FRP molded gratings and marine-grade cable trays served in Dahej SEZ. Dispatched from our Ankleshwar stock point.",
    h1: "Marine FRP Gratings & Dielectric Cable Trays in Dahej",
    introParagraph: "Dahej is a massive petrochemical and port SEZ on the Gulf of Khambhat, characterized by mega-scale chemical factories, LNG terminals, and fertilizer plants. The combination of highly corrosive chemical vapors, chemical spills, and a salt-laden coastal marine atmosphere presents one of the most destructive environments for industrial infrastructure. Transpower supplies Dahej with marine-grade, fire-retardant molded FRP gratings and pultruded structural beams that are immune to chemical attack and saltwater oxidation. We also specialize in supplying heavy-duty dielectric cable trays to secure critical plant control wiring, alongside high-efficiency motors and switchgears. Dahej is managed directly from our nearby Ankleshwar group office, enabling rapid site survey, prompt delivery, and factory-direct coordination for local engineering contractors.",
    faqs: [
      { q: "Do your composite products have fire-retardant certification for Dahej SEZ?", a: "Yes. Our FRP range is manufactured with specialized fire-retardant resins carrying ASTM E84 Class 1 certification." },
      { q: "How fast can you deliver structural FRP beams to Dahej sites?", a: "Standard structural profiles are dispatched from our Ankleshwar or Vadodara warehouses, arriving on site within 24 to 48 hours." },
      { q: "Do you supply heavy-duty gearboxes for Dahej chemical reactors?", a: "Yes, we supply Rotomotive ROBUS helical gearboxes and motors engineered for continuous agitator and mixer loads." },
      { q: "Are site measurements available for custom safety handrails in Dahej?", a: "Yes, our sales engineers from Ankleshwar can visit your Dahej plant to take dimensions and design a custom layout." }
    ],
    region: "South"
  },
  {
    slug: "hazira",
    name: "Hazira",
    district: "Surat",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Hazira Industrial Zone", "Ichhapore GIDC", "Mora Industrial Cluster"],
    keyIndustries: ["Heavy Steel Mills", "Liquefied Gas Terminals", "Shipbuilding & Marine Ports", "Heavy Petrochemicals"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "Next-day dispatch from Ankleshwar stock point",
    distanceFromVadodaraKm: 165,
    metaTitle: "Hazira Marine FRP Gratings & Heavy Drives | Transpower",
    metaDescription: "Heavy steel-mill and marine port composite solutions supplied in Hazira. Dispatched from Ankleshwar.",
    h1: "FRP Port Walkways, Cable Trays & Heavy Drives in Hazira",
    introParagraph: "Hazira is a major heavy industrial zone in South Gujarat, hosting massive steel mills, shipbuilding yards, LNG terminals, and petrochemical giants. The operational footprint includes marine jetties, open sea berths, and gas pipelines, where high salinity and moisture corrode structural steel. Transpower supplies Hazira with marine-grade molded composite gratings, fiberglass safety ladders, and non-conductive cable management trays. These composite solutions eliminate grounding risks, handle structural loads, and run maintenance-free for over 30 years without repainting. We also supply heavy-duty electric motors and high-torque gearboxes designed for continuous operation in steel mill conveyances and port loaders. Orders are coordinated through our group stock points in Ankleshwar for rapid shipping and technical backing.",
    faqs: [
      { q: "Why is FRP preferred over steel for marine platforms in Hazira?", a: "FRP is immune to sea salt corrosion, requires no sandblasting or painting, is lightweight for easy installation on jetties, and is completely non-conductive." },
      { q: "What electric motors do you supply for heavy steel mill setups in Hazira?", a: "We supply Siemens and CG heavy induction motors with robust cast iron housings built to handle continuous operation under extreme temperature conditions." },
      { q: "What is the transit time from Ankleshwar to Hazira, Surat?", a: "Standard dispatch items arrive at Hazira within 24 hours from our Ankleshwar warehouse." },
      { q: "Are drawings provided for custom structural platforms in Hazira?", a: "Yes. Our engineering office provides complete structural design, load calculations, and CAD drawings for client approval." }
    ],
    region: "South"
  },
  {
    slug: "valsad",
    name: "Valsad",
    district: "Valsad",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 99099 57390"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Gundlav GIDC", "Valsad Industrial Cluster", "Dharampur Industrial Estate"],
    keyIndustries: ["Chemicals & Pharmaceuticals", "Plastic Manufacturing", "Paper and Allied Industries", "Agro-processing"],
    productsServed: ["molded-gratings", "pultruded-profiles", "cable-trays", "electric-motors"],
    deliveryTimeline: "2 days dispatched from Ankleshwar stock point",
    distanceFromVadodaraKm: 220,
    metaTitle: "Valsad Industrial Motors & FRP Products | Transpower",
    metaDescription: "FRP gratings and industrial electric motors supplied in Valsad and Gundlav. Shipped from our Ankleshwar warehouse.",
    h1: "FRP Composite Gratings & Industrial Motors in Valsad",
    introParagraph: "Valsad's industrial activity is centered around the Gundlav GIDC estate, hosting a large number of pharmaceutical labs, plastic extruders, and specialty chemical mills. These plants operate process walkways and floor grids that face chemical splash, solvent spill, and high humidity, causing rapid corrosion of metal panels. Transpower supplies Valsad with acid-resistant molded FRP gratings and pultruded structural beams that do not corrode, require zero repainting, and provide permanent slip resistance. We also supply premium-efficiency electric motors and gearboxes to power local plastic extrusion and processing lines. All Valsad dispatches are handled through our Ankleshwar group stock point, ensuring prompt delivery, complete technical support, and full manufacturer warranty coverage.",
    faqs: [
      { q: "How are orders for Gundlav GIDC in Valsad fulfilled?", a: "Orders are processed at our Ankleshwar warehouse and shipped via reliable local transporters, reaching Valsad within 48 hours." },
      { q: "Are your FRP gratings resistant to pharmaceutical solvents in Valsad labs?", a: "Yes, our vinyl ester and isophthalic resin gratings are tested and certified to resist a wide range of laboratory solvents and acids." },
      { q: "Do you supply energy-efficient motors for plastic extruders in Valsad?", a: "Yes, we supply premium-efficiency Siemens and CG IE3 squirrel cage induction motors to help plants cut electrical operating costs." },
      { q: "Can we request a site engineer to visit our plant in Valsad?", a: "Yes. For layout modeling or motor specifications, our technical representative can schedule a visit to your Valsad facility." }
    ],
    region: "South"
  },

  // ── SAURASHTRA ───────────────────────────────────────────────────────────
  {
    slug: "rajkot",
    name: "Rajkot",
    district: "Rajkot",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Aji GIDC", "Bhaktinagar GIDC", "Metoda GIDC", "Shapar-Veraval GIDC", "Hadamtala GIDC"],
    keyIndustries: ["Metal Casting & Foundries", "Automobile Components", "Submersible Pump Manufacturing", "Machine Tools & Engineering"],
    productsServed: ["gear-boxes", "switchgears", "cable-trays", "electric-motors"],
    deliveryTimeline: "2 days dispatched from Vadodara / Ahmedabad stock points",
    distanceFromVadodaraKm: 300,
    metaTitle: "Foundry Gearboxes & Switchgears Rajkot | Transpower",
    metaDescription: "High-torque industrial gearboxes, motors, and switchgears supplied to Metoda and Aji GIDCs in Rajkot. Dispatched from Vadodara.",
    h1: "Power Transmission & Electrical Distribution in Rajkot",
    introParagraph: "Rajkot is the engineering heart of Saurashtra, characterized by massive casting foundries, forging shops, automobile component manufacturers, and machine tool units. The heavy-duty processes in casting units and foundries subject transmission drives and power panels to severe thermal stress, particulate matter, and continuous load profiles. Transpower supplies Rajkot's engineering clusters in Metoda and Shapar-Veraval with high-efficiency gearboxes, premium induction motors, and modular switchgear panels. Our Rotomotive helical and worm gear drives are engineered to transmit torque with over 96% efficiency under continuous duty cycles. We fulfill and dispatch all Rajkot orders from our main Vadodara manufacturing plant or Ahmedabad group stock points, ensuring rapid delivery, certified equipment performance, and comprehensive warranty coverage for local builders.",
    faqs: [
      { q: "Which gearboxes do you recommend for heavy conveyors in Rajkot foundries?", a: "We supply Rotomotive ROBUS helical gear drives with monobloc cast iron housings built to handle heavy startup torque and foundry vibration." },
      { q: "What is the typical shipping timeline to Metoda GIDC, Rajkot?", a: "Standard gearboxes, motors, and switchgears are dispatched from our Vadodara or Ahmedabad stock points, arriving in Rajkot within 48 hours." },
      { q: "Do you supply control panels for machine tool manufacturers in Rajkot?", a: "Yes. We supply Siemens circuit breakers, contactors, and protection devices to build reliable electrical controls." },
      { q: "Can we source fiberglass cable trays for chemical plating units in Rajkot?", a: "Yes, our non-conductive, acid-resistant FRP cable trays are widely used in Rajkot's metal plating and finishing plants." }
    ],
    region: "Saurashtra"
  },
  {
    slug: "amreli",
    name: "Amreli",
    district: "Amreli",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Amreli GIDC", "Savarkundla Industrial Cluster", "Babra GIDC", "Rajula GIDC", "Jafrabad Port Cluster"],
    keyIndustries: ["Agro-processing & Cotton Ginning", "Oil Milling", "Marine Shipping Support", "Rural Power Distribution"],
    productsServed: ["gear-boxes", "switchgears", "molded-gratings", "electric-motors"],
    deliveryTimeline: "3 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 310,
    metaTitle: "Ginning Mill Gearboxes & Motors Amreli | Transpower",
    metaDescription: "Industrial gearboxes and motors supplied to Amreli and Savarkundla. Dispatched from our central Vadodara factory.",
    h1: "Industrial Gear Drives & Electrical Switchgears in Amreli",
    introParagraph: "Amreli's economy centers on agricultural processing, cotton ginning mills, and vegetable oil refining, alongside heavy port-related marine fabrications in Rajula and Jafrabad. Cotton ginning and oil milling require robust transmission machinery and electrical safety equipment that can handle dust, moisture, and high starting loads. We supply Amreli's agro-mills with premium energy-efficient electric motors, heavy-torque gearboxes, and Siemens switchgear components to ensure continuous operation during harvest seasons. For coastal marine yards, we supply corrosion-proof composite gratings and non-conductive cable management trays. All Amreli orders are processed and dispatched from our main Vadodara plant. We coordinate with reliable logistics networks to ensure safe, damage-free delivery to all Saurashtra sites.",
    faqs: [
      { q: "Do you supply heavy motors for cotton ginning machinery in Amreli?", a: "Yes, we supply premium-efficiency Siemens and CG motors with IP55 protection ratings, built to resist heavy cotton lint and dust." },
      { q: "What is the typical shipping timeline to Savarkundla or Rajula?", a: "Deliveries from our Vadodara factory are dispatched via regular Saurashtra transport routes and arrive on site within 2 to 3 days." },
      { q: "Can we use FRP gratings for jetty walk decks in Jafrabad port?", a: "Yes. Our marine-grade composite gratings are certified to resist sea salt corrosion and provide permanent slip protection." },
      { q: "What is the MOQ for gearboxes shipped to Amreli?", a: "We support both single-unit replacements for mill repairs and bulk project supplies. There is no strict MOQ constraint." }
    ],
    region: "Saurashtra"
  },
  {
    slug: "jamnagar",
    name: "Jamnagar",
    district: "Jamnagar",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Jamnagar GIDC Phase 1-3", "Reliance SEZ (Moti Khavdi)", "Essar Oil Cluster", "Bedeshwar GIDC"],
    keyIndustries: ["Petroleum & Refining Complexes", "Brass Components Manufacturing", "Power Generation", "Marine Infrastructure"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "2-3 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 390,
    metaTitle: "Petroleum Refineries FRP Gratings Jamnagar | Transpower",
    metaDescription: "FRP molded gratings and dielectric cable trays supplied to Jamnagar brass clusters and petrochemical zones. Dispatched from Vadodara.",
    h1: "FRP Refine Walkways, Cable Trays & Brass Mill Drives in Jamnagar",
    introParagraph: "Jamnagar holds a prominent position on the global energy map, containing some of the world's largest petroleum refineries, petrochemical plants, and thermal power utilities. The area also hosts India's densest concentration of brass component extrusion and casting workshops. Petrochemical refining operations release highly acidic vapors and caustic wastewater, which destroy standard structural steel layouts within a few years. Transpower supplies Jamnagar's petrochemical zones with specialized fire-retardant vinyl ester FRP gratings, composite cable trays, and structural profiles that resist chemical attack. We also supply heavy-duty gearboxes, electric motors, and switchgears to power refinery conveyors and brass extruders. All Jamnagar shipments are dispatched from our central Vadodara factory, backed by certified testing sheets and full technical drawing support.",
    faqs: [
      { q: "Do you supply fire-retardant gratings for petrochemical refineries in Jamnagar?", a: "Yes, our vinyl ester composite gratings carry ASTM E84 Class 1 fire rating with a flame spread index below 25, meeting refinery safety codes." },
      { q: "What is the shipping schedule to Moti Khavdi, Jamnagar?", a: "Standard materials are dispatched from our Vadodara factory, arriving at Jamnagar industrial sites within 48 to 72 hours." },
      { q: "Can we source high-torque gearboxes for brass wire-drawing in Jamnagar?", a: "Yes. We supply Rotomotive ROBUS helical gearboxes, which are highly efficient and ideal for brass extrusion and drawing lines." },
      { q: "Do you provide custom-colored FRP gratings for warning boundaries in refineries?", a: "Yes, we can manufacture composite panels in custom colors, including bright safety yellow and warning orange." }
    ],
    region: "Saurashtra"
  },
  {
    slug: "bhavnagar",
    name: "Bhavnagar",
    district: "Bhavnagar",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Chitra GIDC", "Alang Ship Breaking Yard", "Sihor Industrial Cluster", "Bhavnagar Port Zone"],
    keyIndustries: ["Ship Recycling & Salvaging", "Steel Re-rolling Mills", "Marine & Offshore Fabrication", "Chemicals & Plastics"],
    productsServed: ["molded-gratings", "pultruded-profiles", "cable-trays", "electric-motors", "gear-boxes"],
    deliveryTimeline: "2-3 days dispatched from Vadodara / Ahmedabad stock points",
    distanceFromVadodaraKm: 270,
    metaTitle: "Alang Shipyard FRP Gratings & Marine Products | Transpower",
    metaDescription: "FRP marine-grade gratings and steel mill gearboxes supplied to Alang and Bhavnagar. Dispatched from Vadodara.",
    h1: "FRP Marine Gratings, Cable Trays & Steel Mill Gearboxes in Bhavnagar",
    introParagraph: "Bhavnagar's industrial landscape is highlighted by the Alang Ship Breaking Yard, the world's largest ship recycling site, along with steel re-rolling mills in Sihor and marine component manufacturers. Ship salvaging and re-rolling mills operate under high mechanical loads, abrasive dust, and aggressive sea salt corrosion. Transpower supplies the Alang yard and Bhavnagar port complexes with high-strength, marine-grade composite gratings, fiberglass safety handrails, and dielectric cable trays. These products resist saltwater damage and require no painting, ensuring safe working decks on salvage vessels and jetties. We also supply heavy-duty electric motors and gear drives to support re-rolling mill rollers and heavy winches. All Bhavnagar orders are dispatched from our Vadodara or Ahmedabad hubs, guaranteeing reliable logistics and full technical certification.",
    faqs: [
      { q: "Are your FRP gratings approved for marine vessel decking in Alang?", a: "Yes, our fiberglass molded gratings are manufactured in compliance with international ABS marine standards, making them suitable for shipboard and offshore use." },
      { q: "What is the delivery timeline for orders shipped to Sihor steel mills?", a: "Materials are dispatched from our Vadodara or Ahmedabad group warehouses, arriving at Sihor industrial sites within 48 hours." },
      { q: "Do you supply heavy-duty winching gearboxes for Alang salvaging work?", a: "Yes, we supply Rotomotive high-torque helical gearboxes capable of handling the extreme loads of marine recovery operations." },
      { q: "Can we request custom pultruded structural section profiles for port layouts?", a: "Yes. We offer custom pultrusion profiles including heavy I-beams, box tubes, and channels designed for high load capacity." }
    ],
    region: "Saurashtra"
  },
  {
    slug: "morbi",
    name: "Morbi",
    district: "Morbi",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Morbi Ceramic Zone (Lakhdhirpur Road)", "Wankaner Ceramic Cluster", "Halvad GIDC"],
    keyIndustries: ["Ceramic Tiles & Sanitaryware", "Packaging & Paper Box Units", "Roofing Tiles", "Coal Gasifiers"],
    productsServed: ["gear-boxes", "electric-motors", "switchgears", "molded-gratings"],
    deliveryTimeline: "2 days dispatched from Ahmedabad / Vadodara stock points",
    distanceFromVadodaraKm: 340,
    metaTitle: "Ceramic Conveyor Gearboxes & Motors Morbi | Transpower",
    metaDescription: "High-torque ceramic kiln conveyor gearboxes and electric motors served in Morbi. Dispatched from our Vadodara plant.",
    h1: "Ceramic Kiln Conveyor Gearboxes & Motors in Morbi",
    introParagraph: "Morbi is the ceramic tiles capital of India, housing hundreds of state-of-the-art tiles and sanitaryware manufacturing factories along Lakhdhirpur and Jetpar roads. Ceramic production runs 24/7, relying on continuous-duty kiln conveyors, glaze agitators, and packaging lines operating under high heat, dust, and humidity. Transpower supplies Morbi's tile plants with high-efficiency gearboxes and energy-efficient electric motors designed to handle high mechanical loads and abrasive dust without breaking down. Our Rotomotive ROBUS helical gear drives and worm gear systems are pre-filled with high-grade synthetic oil to run maintenance-free in extreme ceramic environments. We manage Morbi supplies through our Ahmedabad and Vadodara group warehouses, providing next-day dispatch, certified performance, and prompt on-site engineering coordination for tile manufacturers.",
    faqs: [
      { q: "What type of gearbox is recommended for ceramic kiln conveyors in Morbi?", a: "We supply Rotomotive QUBO worm gearboxes (sizes 30 to 90) pre-filled with synthetic oil, offering maintenance-free operation under high heat." },
      { q: "How fast can you deliver standard electric motors to Morbi ceramic units?", a: "Standard Siemens and Crompton Greaves motors are dispatched from our Ahmedabad stock point, arriving at Morbi sites within 24 to 48 hours." },
      { q: "Are your FRP gratings used in ceramic clay preparation plants?", a: "Yes. Our composite gratings are widely installed around clay slip washers and wet glaze preparation tanks to prevent rust and slip accidents." },
      { q: "Do you supply switchgear components for ceramic automation panels?", a: "Yes, we distribute Siemens air circuit breakers, MCCBs, and motor contactors to secure continuous kiln operations." }
    ],
    region: "Saurashtra"
  },

  // ── NORTH GUJARAT ────────────────────────────────────────────────────────
  {
    slug: "gandinagar",
    name: "Gandhinagar",
    district: "Gandhinagar",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Gandhinagar GIDC Sector 25-28", "Pethapur GIDC", "Kalo Industrial Area Cluster"],
    keyIndustries: ["Electronics & IT Hardware", "Thermal Power Generation", "Food Processing", "Government Infrastructure"],
    productsServed: ["switchgears", "cable-trays", "molded-gratings", "electric-motors"],
    deliveryTimeline: "2 days dispatched from Ahmedabad / Vatva stock point",
    distanceFromVadodaraKm: 130,
    metaTitle: "FRP Cable Trays & Power Switchgears Gandhinagar | Transpower",
    metaDescription: "FRP cable trays and power switchgears supplied to Gandhinagar and Kalol. Dispatched from Vatva, Ahmedabad.",
    h1: "Power Switchgears, Cable Trays & FRP Gratings in Gandhinagar",
    introParagraph: "Gandhinagar, the state capital of Gujarat, is a major center for electronics assembly, food packaging, and thermal power generation. The local thermal power complexes and high-voltage grid stations demand high-performance dielectric cable management systems and electrical safety controls. Transpower supplies Gandhinagar and surrounding industrial pockets with fiberglass-reinforced plastic (FRP) cable trays that eliminate grounding risks and resist outdoor weather. We also supply Siemens switchgear controls and premium electric motors to support municipal water distribution and local manufacturing units. Gandhinagar is serviced directly from our group company stock point in Vatva, Ahmedabad (just 25km away), ensuring rapid delivery, complete compliance documentation, and prompt technical support.",
    faqs: [
      { q: "How do you service Gandhinagar and Sector 25 GIDC?", a: "Gandhinagar is serviced from our group company warehouse in Vatva, Ahmedabad, allowing for daily shipping and prompt customer support." },
      { q: "Do you supply FRP cable trays for thermal power plants in Gandhinagar?", a: "Yes, our dielectric, self-extinguishing FRP ladder and perforated cable trays are widely used in power stations for high electrical insulation." },
      { q: "Can we source Siemens circuit breakers for local panel builders in Gandhinagar?", a: "Yes, we are an authorized dealer supplying Siemens ACBs, MCCBs, and contactors with complete warranty support." },
      { q: "What is the delivery timeline for standard products to Gandhinagar?", a: "Standard inventory items are delivered within 24 hours of order confirmation from our Vatva stock point." }
    ],
    region: "North"
  },
  {
    slug: "sanand",
    name: "Sanand",
    district: "Ahmedabad",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Sanand GIDC Phase 1 & 2", "Sanand Bol GIDC", "Viramgam Industrial Estate"],
    keyIndustries: ["Automobile & Auto Parts", "FMCG Products", "Pharmaceutical Formulations", "General Engineering"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "Next-day dispatch from Ahmedabad / Vatva stock point",
    distanceFromVadodaraKm: 135,
    metaTitle: "Automobile GIDC FRP Gratings & Drives Sanand | Transpower",
    metaDescription: "FRP molded gratings, cable trays, and motor drives supplied to Sanand automotive cluster. Dispatched from Vatva.",
    h1: "FRP Safety Flooring, Cable Trays & Kiln Motors in Sanand",
    introParagraph: "Sanand is a premier automotive and industrial hub, hosting mega automobile plants, FMCG packaging giants, and pharma formulation facilities. Automotive paint shops and chemical formulation halls require floor walkways and structural parts that can handle daily chemical washdowns and heavy wheel traffic. Transpower supplies Sanand with high-strength composite molded gratings and fiberglass structural handrails. We also distribute authorized Siemens and CG electric motors, Rotomotive high-torque gearboxes, and Siemens switchgear setups to power automotive assembly lines. Located close to our Vatva, Ahmedabad group office, we ensure next-day delivery, complete engineering support, and rapid on-site site surveys for all Sanand factories.",
    faqs: [
      { q: "How are deliveries to Sanand GIDC managed?", a: "Deliveries are made daily from our Vatva, Ahmedabad stock point or Makarpura, Vadodara factory, reaching Sanand within 24 hours." },
      { q: "Are your FRP gratings chemical-resistant for automotive paint shops in Sanand?", a: "Yes, our vinyl ester and polyester resin gratings are highly resistant to solvents and acid washdowns in paint shops." },
      { q: "Do you supply premium electric motors for Sanand FMCG lines?", a: "Yes, we supply Crompton Greaves and Siemens IE3 energy-efficient motors designed for continuous manufacturing conveyor lines." },
      { q: "Can we request drawing submissions for custom platform layouts in Sanand?", a: "Yes. Our engineering office provides complete structural design, load calculations, and CAD drawings for client approval." }
    ],
    region: "North"
  },
  {
    slug: "mehsana",
    name: "Mehsana",
    district: "Mehsana",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07517"],
    email: ["sales@transpower.net.in"],
    servedIndustrialAreas: ["Mehsana GIDC Phase 1 & 2", "Kadi GIDC Cluster", "Dhedhal Industrial Area"],
    keyIndustries: ["Large Dairy Cooperatives", "Oil and Natural Gas Extraction", "Heavy Engineering", "Textile & Sizing Processing"],
    productsServed: ["gear-boxes", "molded-gratings", "electric-motors", "cable-trays"],
    deliveryTimeline: "2 days dispatched from Ahmedabad stock point",
    distanceFromVadodaraKm: 180,
    metaTitle: "Dairy Plant FRP Floorings & Motor Drives Mehsana | Transpower",
    metaDescription: "FRP gratings and industrial motors supplied to Mehsana dairy and oil clusters. Dispatched from Ahmedabad.",
    h1: "FRP Hygienic Flooring, Cable Trays & Kiln Motors in Mehsana",
    introParagraph: "Mehsana's industrial profile includes some of Asia's largest dairy cooperatives, major ONGC oil extraction grids, and sizing factories. Dairy plant corridors and oil collection structures require strict hygiene, moisture resistance, and continuous safety. We supply Mehsana's food-processing lines with hygienic, non-corrosive molded FRP gratings that do not harbor bacteria and prevent slip accidents on wet floors. We also supply heavy-duty electric motors, gearboxes, and dielectric cable trays to support ONGC extraction sites and engineering shops. All Mehsana orders are handled through our Vatva, Ahmedabad group office, ensuring quick 48-hour delivery, certified safety compliance, and comprehensive technical support.",
    faqs: [
      { q: "What is the typical shipping timeline to Kadi or Mehsana GIDC?", a: "Orders are processed at our Ahmedabad stock point and delivered via local transport networks within 24 to 48 hours." },
      { q: "Are your FRP gratings certified for slip resistance in wet dairy bays?", a: "Yes, our quartz-grit embedded top surface carries an R13 slip resistance rating (DIN 51130) for wet environments." },
      { q: "Do you supply heavy-duty motors for ONGC pumping units in Mehsana?", a: "Yes, we supply robust Siemens and CG induction motors with IP55 protection, engineered for heavy-duty outdoor operations." },
      { q: "What is the minimum order quantity for FRP cable trays to Mehsana?", a: "We support both single-length replacements for small repairs and bulk project deliveries. Contact us for custom quotes." }
    ],
    region: "North"
  },

  // ── KUTCH ────────────────────────────────────────────────────────────────
  {
    slug: "bhuj",
    name: "Bhuj",
    district: "Kutch",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Bhuj GIDC Cluster", "Madhapar Industrial Area", "Anjar Industrial Zone", "Gandhidham Industrial Hub"],
    keyIndustries: ["Salt & Marine Chemicals", "Port & Shipping Operations", "Thermal Power Generation", "Cement Production"],
    productsServed: ["cable-trays", "molded-gratings", "pultruded-profiles", "switchgears", "electric-motors"],
    deliveryTimeline: "3 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 450,
    metaTitle: "Kutch Salt-Resistant FRP Gratings & Cable Trays Bhuj | Transpower",
    metaDescription: "Corrosion-resistant marine FRP gratings and cable trays serving Bhuj and Kutch. Dispatched from Vadodara.",
    h1: "Marine FRP Gratings, Cable Trays & Switchgear Systems in Bhuj",
    introParagraph: "Bhuj and the wider Kutch region feature an aggressive industrial landscape with salt works, marine chemical plants, ports, and mega thermal power stations. The high salinity, humidity, and chemical exposure in salt-washing plants cause rapid corrosion of metallic structures. Transpower supplies the Kutch district with marine-grade molded composite gratings, fiberglass safety handrails, and non-conductive cable management trays. These composite products are UV-stabilized, completely immune to salt oxidation, and require zero painting, lowering maintenance costs significantly. We also supply heavy-duty switchgears and electric motors to power Kutch's cement plants and port conveyors. All Kutch orders are dispatched from our Vadodara manufacturing plant, ensuring secure packaging and verified test certifications.",
    faqs: [
      { q: "Why use FRP gratings in Kutch's salt and marine chemical units?", a: "FRP is immune to sea salt and chloride corrosion, requires no sandblasting or painting, is lightweight for easy installation on jetties, and is completely non-conductive." },
      { q: "What is the typical shipping timeline to Gandhidham or Bhuj from Vadodara?", a: "Materials are dispatched from our Vadodara factory, arriving at Kutch industrial sites within 48 to 72 hours." },
      { q: "Are your FRP cable trays certified for outdoor electrical substations in Kutch?", a: "Yes, our composite trays are UV-stabilized, dielectric, and fire-retardant, making them ideal for high-exposure outdoor substations." },
      { q: "Do you supply heavy motors for Kutch cement and mineral plants?", a: "Yes, we supply premium cast iron Siemens and Crompton Greaves induction motors built to handle continuous loads in cement mills." }
    ],
    region: "Kutch"
  },
  {
    slug: "mundra",
    name: "Mundra",
    district: "Kutch",
    state: "Gujarat",
    type: "service-area",
    phone: ["+91 98255 07527"],
    email: ["baroda@transpower.net.in"],
    servedIndustrialAreas: ["Mundra SEZ", "Adani Port Industrial Zone", "Mundra Port Cluster"],
    keyIndustries: ["Mega Ports and Logistics", "Coal Thermal Power Stations", "Chemical Storage and Terminals", "Special Economic Zone (SEZ)"],
    productsServed: ["molded-gratings", "cable-trays", "pultruded-profiles", "gear-boxes", "switchgears", "electric-motors"],
    deliveryTimeline: "3 days dispatched from Vadodara stock point",
    distanceFromVadodaraKm: 420,
    metaTitle: "Mundra Port FRP Marine Gratings & Cable Trays | Transpower",
    metaDescription: "FRP marine-grade gratings and dielectric cable trays served in Mundra SEZ and Port. Dispatched from Vadodara.",
    h1: "FRP Jetties, Cable Trays & High-Voltage Systems in Mundra",
    introParagraph: "Mundra is home to one of India's largest private ports, mega SEZs, and massive coal-fired thermal power stations. The coastal location combines marine salinity, sulfurous coal dust, and chemical terminal handling—creating an aggressive corrosion environment. Transpower supplies Mundra Port and SEZ with marine-grade molded composite gratings, fiberglass safety handrails, and non-conductive cable management trays. These composite products eliminate electrical grounding risks on coal conveyors and stand up to marine weathering. We also supply heavy-duty gearboxes, electric motors, and switchgears to power port equipment and conveyor lines. All Mundra orders are dispatched from our Vadodara plant, ensuring secure packaging, verified test certificates, and prompt technical support.",
    faqs: [
      { q: "Do you supply composite products with marine certifications for Mundra Port?", a: "Yes. Our composite range is manufactured in compliance with international ABS marine standards, making them suitable for shipboard and offshore use." },
      { q: "How fast can you deliver structural FRP beams to Mundra SEZ sites?", a: "Standard structural profiles are dispatched from our Vadodara warehouse, arriving on site within 48 to 72 hours." },
      { q: "Do you supply heavy-duty gearboxes for Mundra Port coal conveyors?", a: "Yes, we supply Rotomotive high-torque helical gearboxes capable of handling the extreme loads of marine recovery operations." },
      { q: "Are drawings provided for custom structural platforms in Mundra?", a: "Yes. Our engineering office provides complete structural design, load calculations, and CAD drawings for client approval." }
    ],
    region: "Kutch"
  }
];

export const getCityBySlug = (slug: string): CityLocation | null =>
  CITIES.find((c) => c.slug === String(slug || "").toLowerCase()) || null;

export const orderedProductIds = (city: CityLocation, allProductIds: string[]): string[] => {
  const served = city.productsServed.filter((id) => allProductIds.includes(id));
  return [...served, ...allProductIds.filter((id) => !served.includes(id))];
};

export const nearbyCities = (city: CityLocation, limit = 4): CityLocation[] =>
  CITIES.filter((c) => c.slug !== city.slug)
    .map((c) => ({ ...c, gap: Math.abs(c.distanceFromVadodaraKm - city.distanceFromVadodaraKm) }))
    .sort((a, b) => a.gap - b.gap)
    .slice(0, limit);
