// Company-level contact, group, and testimonial data.
// Single source of truth across the entire application.

const makeTextLogoSvg = (text) => 
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="50" viewBox="0 0 140 50"><rect width="100%" height="100%" fill="none"/><text x="50%" y="58%" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="%238892b0" text-anchor="middle">${text}</text></svg>`;

// Canonical company coordinates
export const COMPANY_DETAILS = {
  name: "Transpower Technologies Pvt. Ltd.",
  address: "346, Makarpura GIDC, Makarpura, Vadodara, Gujarat 390010, India",
  phones: ["+91 98255 07527", "+91 98255 07517", "+91 99099 57390"],
  whatsapp: "+91 98255 07527",
  emails: [
    "baroda@transpower.net.in",
    "sales@transpower.net.in",
    "frp@transpower.net.in"
  ],
  clientReviewEmails: ["sales@transpower.com"],
};

// Department specific contact people
export const DEPARTMENTS = {
  MOTOR: [
    { name: "Dhara Panchal", phone: "+91 98255 07568", email: "dhara@transpower.net.in" },
    { name: "Saji Varghese", phone: "+91 96388 79797", email: "dhara@transpower.net.in" }
  ],
  SWITCHGEAR: [
    { name: "Viral Shah", phone: "+91 98255 06945", email: "viral@transpower.net.in" },
    { name: "Jagruti Panchal", phone: "+91 98255 07527", email: "viral@transpower.net.in" }
  ],
  FRP: [
    { name: "Rajesh Dutta", phone: "+91 99099 47490", email: "frp@transpower.net.in" }
  ],
  SALES: [
    { name: "Urjit Naik", phone: "+91 98255 07563", email: "sales@transpower.net.in" }
  ]
};

// Group offices details
export const GROUP_OFFICES = [
  {
    name: "Vadodara (Head Office)",
    description: "Main Sales Office & Manufacturing Facility",
    address: "346, Makarpura GIDC, Makarpura, Vadodara, Gujarat",
    pincode: "390010",
    phone: ["+91 98255 07527", "+91 98255 07517", "+91 99099 57390"],
    email: ["baroda@transpower.net.in", "sales@transpower.net.in"],
    isSalesOffice: true,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.656847844078!2d73.2003889!3d22.2530965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5e505555555%3A0xe5a3bb45f95fc74f!2s346%2C%20Makarpura%20GIDC%2C%20Makarpura%2C%20Vadodara%2C%20Gujarat% 390010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
  },
  {
    name: "Ankleshwar (Techno Sales Agency)",
    description: "Group Office",
    address: "B/5-6, Kewal Shopping Centre, Old N H No 8, GIDC, Ankleshwar, Gujarat",
    pincode: "393002",
    phone: [],
    email: [],
    isSalesOffice: true,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.886071477755!2d73.003664!3d21.629393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0208fa5555555%3A0x6b8bc27c62c3d5ef!2sKewal%20Shopping%20Centre%2C%20GIDC%2C%20Ankleshwar%2C%20Gujarat%20393002!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin"
  },
  {
    name: "Ahmedabad (Shreeraj Traders)",
    description: "Group Office",
    address: "39, Mahalaxmi Industrial Estate, Bombay Conductor Rd, Vatva, Ahmedabad, Gujarat",
    pincode: "382445",
    phone: [],
    email: [],
    isSalesOffice: true,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.3082531061957!2d72.631899!3d22.957262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8f4ab5555555%3A0x8e8dbb064c5d5e5c!2sMahalaxmi%20Industrial%20Estate%2C%20Vatva%2C%20Ahmedabad%2C%20Gujarat%20382445!5e0!3m2!1sen!2sin!4v1700000000002!5m2!1sen!2sin"
  },
  {
    name: "Apidel Technologies",
    description: "Group Company (Non-Sales Office)",
    address: "4th Floor Pancham Icon, Vasna Rd, beside D Mart Mall, Vadodara, Gujarat",
    pincode: "390007",
    phone: [],
    email: [],
    isSalesOffice: false
  }
];

// Testimonials from clients
export const TESTIMONIALS = [
  {
    quote: "The quality and durability of the FRP gratings purchased from Transpower Technologies are exceptional. Their composite products have solved our chemical corrosion issues, and the team provided excellent support throughout the procurement and installation process.",
    author: "Atul Panchal",
    company: "Shiva Pharma"
  },
  {
    quote: "As a company heavily reliant on industrial equipment, we appreciate the expertise and support provided by Transpower Technologies. Their knowledge of Siemens, Crompton Greaves, and Hindustan induction motors is unmatched, making them a valuable partner for our business.",
    author: "Abhay",
    company: "Spectom"
  },
  {
    quote: "We found Transpower Technologies to be very competitive in pricing for Siemens switchgear. Their technical assistance in product selection was extremely helpful, helping us choose the most efficient solution for our power systems.",
    author: "Mukesh Dobariya",
    company: "Hi-Make"
  },
  {
    quote: "Transpower Technologies has been our reliable partner for sourcing Crompton Greaves induction motors. Their responsiveness to our queries and prompt delivery of products have helped us meet our project deadlines without any hassle.",
    author: "Rakesh Gaveriya",
    company: "Mech Tech Machine Pvt Ltd"
  }
];

// Certifications array
export const CERTIFICATIONS = [
  { name: "ISO 9001:2015", status: "Verified", body: "ISO" }
];

// Partner brand ecosystem
export const BRANDS = [
  { name: 'SIEMENS', logo: '/assets/images/brand_siemens.png' },
  { name: 'CROMPTON GREAVES', logo: '/assets/images/brand_crompton.png' },
  { name: 'INNOMOTICS', logo: '/assets/images/brand_innomotics.png' },
  { name: 'HINDUSTAN ELECTRIC MOTORS', logo: '/assets/images/brand_hindustan.png' },
  { name: 'ROTOMOTIVE', logo: '/assets/images/brand_rotomotive.png' }
];

// Reputed clients list (populates logo strip using local assets)
export const CLIENTS = [
  { name: 'TBEA', logo: makeTextLogoSvg('TBEA') },
  { name: 'Alembic', logo: makeTextLogoSvg('Alembic') },
  { name: 'Aerzen', logo: makeTextLogoSvg('Aerzen') },
  { name: 'R-K Bio', logo: makeTextLogoSvg('R-K Bio') },
  { name: 'Hi-Make', logo: makeTextLogoSvg('Hi-Make') },
  { name: 'Nayra', logo: makeTextLogoSvg('Nayra') },
  { name: 'Shiva Pharma', logo: makeTextLogoSvg('Shiva Pharma') },
  { name: 'Anupam', logo: makeTextLogoSvg('Anupam') },
  { name: 'GEA', logo: makeTextLogoSvg('GEA') },
  { name: 'GSFC', logo: makeTextLogoSvg('GSFC') },
  { name: 'GACL', logo: makeTextLogoSvg('GACL') },
  { name: 'Hero', logo: makeTextLogoSvg('Hero') },
  { name: 'PI Industries', logo: makeTextLogoSvg('PI Industries') }
];
