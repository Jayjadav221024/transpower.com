const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const destPath = path.join(__dirname, '../frontend/public/assets/transpower_corporate_brochure.pdf');
const doc = new PDFDocument({ margin: 50, size: 'A4' });

// Ensure output directory exists
const dir = path.dirname(destPath);
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

doc.pipe(fs.createWriteStream(destPath));

// Color Palette
const PRIMARY = '#1e293b'; // Slate 800
const SECONDARY = '#d9653b'; // Accent Orange
const TEXT_DARK = '#334155'; // Slate 700
const TEXT_MUTED = '#64748b'; // Slate 500
const BG_LIGHT = '#f8fafc'; // Slate 50
const LINE_COLOR = '#cbd5e1'; // Slate 300

// Helper to draw horizontal lines
function hr(y) {
  doc.strokeColor(LINE_COLOR).lineWidth(1).moveTo(50, y).lineTo(545, y).stroke();
}

// ── PAGE 1: COVER PAGE ──────────────────────────────────────────────────────
doc.rect(0, 0, 595, 842).fill('#ffffff');

// Decorative top colored block
doc.rect(0, 0, 595, 25).fill(PRIMARY);
doc.rect(0, 25, 595, 8).fill(SECONDARY);

// Logo / Branding
doc.fillColor(PRIMARY).fontSize(28).font('Helvetica-Bold').text('TRANSPOWER', 50, 150);
doc.fillColor(SECONDARY).fontSize(14).font('Helvetica-Bold').text('TECHNOLOGIES PVT. LTD.', 50, 185);

doc.fillColor(TEXT_MUTED).fontSize(12).font('Helvetica').text('Industrial Electro-Mechanical & FRP Composite Solutions', 50, 210);

// Accent Orange Divider
doc.rect(50, 235, 120, 4).fill(SECONDARY);

// Main Cover Image Area / Graphic Placeholder
doc.rect(50, 280, 495, 240).fill(BG_LIGHT);
doc.strokeColor(LINE_COLOR).lineWidth(1).rect(50, 280, 495, 240).stroke();

doc.fillColor(PRIMARY).fontSize(20).font('Helvetica-Bold').text('CORPORATE CATALOG & BROCHURE', 70, 360, { width: 450, align: 'center' });
doc.fillColor(TEXT_MUTED).fontSize(11).font('Helvetica-Oblique').text('Providing Switchgears, Electric Motors, FRP Gratings, Cable Trays & Gearboxes', 70, 395, { width: 450, align: 'center' });

// Cover Footer Contact Details
doc.fillColor(PRIMARY).fontSize(10).font('Helvetica-Bold').text('Registered Office & Works:', 50, 620);
doc.fillColor(TEXT_DARK).fontSize(9).font('Helvetica').text('346 GIDC, Makarpura, Vadodara - 390010, Gujarat, India', 50, 638);
doc.text('Phone: +91 98255 07517 / 37   |   WhatsApp: +91 98255 07527', 50, 655);
doc.text('Emails: sales@transpower.com  |  baroda@transpower.net.in  |  frp@transpower.net.in', 50, 672);
doc.text('Website: www.transpower.co.in', 50, 689);

// Decorative Bottom Accent
doc.rect(0, 809, 595, 8).fill(SECONDARY);
doc.rect(0, 817, 595, 25).fill(PRIMARY);


// ── PAGE 2: ABOUT US & PARTNERS ─────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, 595, 25).fill(PRIMARY);
doc.rect(0, 25, 595, 8).fill(SECONDARY);

doc.fillColor(PRIMARY).fontSize(22).font('Helvetica-Bold').text('About Transpower', 50, 80);
doc.rect(50, 110, 80, 3).fill(SECONDARY);

const aboutText = `Transpower Technologies Pvt. Ltd. is a premier engineering and distribution house established in Vadodara, Gujarat. For over five decades, we have partnered with India's leading industrial sectors to supply state-of-the-art power distribution systems, energy-efficient electric motors, high-quality gearboxes, and corrosion-resistant FRP composites.

Our core commitment lies in engineering excellence, prompt technical support, and maintaining robust inventory levels to support critical industrial applications round-the-clock.`;

doc.fillColor(TEXT_DARK).fontSize(10.5).font('Helvetica').text(aboutText, 50, 130, {
  width: 495,
  align: 'justify',
  lineGap: 4
});

doc.fillColor(PRIMARY).fontSize(16).font('Helvetica-Bold').text('Authorized Brand Partnerships', 50, 260);
doc.rect(50, 282, 80, 2).fill(SECONDARY);

// Brands list
const brands = [
  { name: 'SIEMENS', desc: 'Authorized Partner for Low Voltage Motors & Premium Switchgears' },
  { name: 'INNOMOTICS', desc: 'Partnering in state-of-the-art high-efficiency electric motors' },
  { name: 'CROMPTON GREAVES (CG)', desc: 'Full range of standard industrial AC and flameproof motors' },
  { name: 'HINDUSTAN ELECTRIC MOTORS (HEM)', desc: 'Premium durable cast iron and flameproof motors' },
  { name: 'ROTOMOTIVE', desc: 'Helical ROBUS series & Worm QUBO series gearboxes' }
];

let brandY = 300;
brands.forEach(b => {
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text(b.name, 50, brandY);
  doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').text(b.desc, 50, brandY + 15);
  brandY += 45;
});

// Quality Certifications
doc.fillColor(PRIMARY).fontSize(16).font('Helvetica-Bold').text('Quality & Compliance Standards', 50, 550);
doc.rect(50, 572, 80, 2).fill(SECONDARY);

const complianceText = `Our supplied range conforms to rigorous quality standards:
• Quality Management Systems certified under ISO 9001:2015.
• FRP composite products certified under ASTM E84 Class 1 for flame spread.
• Marine grade composites compliant with American Bureau of Shipping (ABS) certifications.
• Switchgear solutions carrying CPRI and ERDA type-test compliance certification.`;

doc.fillColor(TEXT_DARK).fontSize(10).font('Helvetica').text(complianceText, 50, 590, {
  width: 495,
  lineGap: 3
});


// ── PAGE 3: PRODUCT CATALOG (SWITCHGEARS & MOTORS) ─────────────────────────
doc.addPage();
doc.rect(0, 0, 595, 25).fill(PRIMARY);
doc.rect(0, 25, 595, 8).fill(SECONDARY);

doc.fillColor(PRIMARY).fontSize(20).font('Helvetica-Bold').text('B2B Product Portfolio', 50, 80);
doc.rect(50, 105, 80, 3).fill(SECONDARY);

// Category 1: Power Switchgears
doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text('1. Power Switchgears & Distribution Systems', 50, 130);
const swText = `Heavy-duty electrical protection and control equipment tailored for safe power distribution:
• Air Circuit Breakers (ACB): High current capacity breakers for main power line protection.
• Molded Case Circuit Breakers (MCCB): Dependable short-circuit & thermal overload protection.
• Miniature Circuit Breakers (MCB): High-grade din-rail mounted protection for auxiliary circuits.
• Sinova Switchgears: Siemens partnered range for reliable industrial operations.`;
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').text(swText, 50, 155, { width: 495, lineGap: 3 });

// Category 2: Electric Motors
doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text('2. Industrial Electric Motors', 50, 270);
const motorText = `Highly efficient induction, flameproof, and crane duty motors:
• IE2, IE3, and IE4 Efficiency Classes: Premium energy savings and carbon footprint reduction.
• Cast Iron Housing: Heavy-duty protection conforming to IP55, IP56, and IP65.
• VFD Duty Converter Motors: Suitable for variable speed torque industrial applications.
• Trusted Brands: Authorised distributors for Siemens, Crompton Greaves, and Hindustan Motors.`;
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').text(motorText, 50, 295, { width: 495, lineGap: 3 });

// Category 3: Industrial Gearboxes
doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text('3. Industrial Gearboxes (Rotomotive)', 50, 410);
const gbText = `Highly robust speed reducers for conveyor, mixer, and drive applications:
• ROBUS Helical Gearboxes: Monobloc cast iron housing with capacity up to 4300Nm.
• QUBO Worm Gearboxes: Maintenance-free lightweight aluminium bodies (sizes 30-90) & cast iron bodies (sizes 110-150) pre-lubricated with synthetic oils.`;
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').text(gbText, 50, 435, { width: 495, lineGap: 3 });


// ── PAGE 4: PRODUCT CATALOG (FRP COMPOSITES) ───────────────────────────────
doc.addPage();
doc.rect(0, 0, 595, 25).fill(PRIMARY);
doc.rect(0, 25, 595, 8).fill(SECONDARY);

doc.fillColor(PRIMARY).fontSize(20).font('Helvetica-Bold').text('FRP Composite Solutions', 50, 80);
doc.rect(50, 105, 80, 3).fill(SECONDARY);

// Category 4: Molded FRP Gratings
doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text('4. Molded FRP Gratings', 50, 130);
const gratText = `High-strength, bi-directional mesh panels for industrial walkways and trench covers:
• Gritted Top: Premium quartz-grit surface for absolute slip-resistance in wet/oily areas.
• Meniscus Top: Concave shape providing premium chemical resistance and grip.
• Chequered Plate: Covered gratings preventing liquid drips and providing structural flooring.
• Key Benefits: Lightweight (1/4th of steel), chemical corrosion proof, and non-conductive.`;
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').text(gratText, 50, 155, { width: 495, lineGap: 3 });

// Category 5: FRP Cable Trays
doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text('5. FRP Cable Trays & Accessories', 50, 270);
const trayText = `Heavy-duty glass-reinforced composite cable management systems:
• Ladder Type Cable Trays: High load-bearing capacity for heavy electrical cabling.
• Perforated Type Cable Trays: Continuous bottom support with ventilated slots for signal/power lines.
• Features: Corrosion-proof for marine/chemical zones, zero short-circuit risk, and UV protected.`;
doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica').text(trayText, 50, 295, { width: 495, lineGap: 3 });


// ── PAGE 5: BACK COVER / CTA ────────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, 595, 842).fill(PRIMARY);

doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('TRANSPOWER', 50, 150);
doc.fillColor(SECONDARY).fontSize(14).font('Helvetica-Bold').text('TECHNOLOGIES PVT. LTD.', 50, 185);
doc.rect(50, 210, 150, 3).fill(SECONDARY);

doc.fillColor('#cbd5e1').fontSize(14).font('Helvetica').text('Engineering Trust. Delivering Quality.', 50, 230);

const ctaText = `Whether you need standard energy-efficient electric motors, heavy-duty electrical switchgears, custom-engineered FRP gratings and cable trays, or robust industrial gearboxes, Transpower Technologies is your single-source reliable B2B partner.

Contact our sales engineering office today to request technical brochures, CAD drawings, price catalogs, and factory-direct quotes.`;

doc.fillColor('#f8fafc').fontSize(11).font('Helvetica').text(ctaText, 50, 320, {
  width: 495,
  lineGap: 5
});

doc.rect(50, 500, 495, 180).fill('#1e293b');
doc.strokeColor(SECONDARY).lineWidth(1.5).rect(50, 500, 495, 180).stroke();

doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('Get in Touch with Our Engineering Team', 70, 525);

doc.fillColor('#cbd5e1').fontSize(10).font('Helvetica').text('📍 Address: 346 GIDC, Makarpura, Vadodara - 390010, Gujarat, India', 70, 555);
doc.text('📞 Phone: +91 98255 07517 / 37', 70, 580);
doc.text('💬 WhatsApp Support: +91 98255 07527', 70, 605);
doc.text('✉️ Emails: sales@transpower.com  |  baroda@transpower.net.in  |  frp@transpower.net.in', 70, 630);

doc.end();

console.log('PDF corporate brochure successfully generated.');
