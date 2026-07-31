const PageContent = require('../models/PageContent');

const DEFAULTS = {
  homepage: {
    heroTitle: 'Pioneering Fiberglass Composites & Transmission Solutions',
    heroSubtitle: 'High-performance industrial engineering for power systems, chemical plants, and heavy manufacturers globally.',
    specTitle: 'Technical Specifications',
    specBullets: [
      'High mechanical strength & structural stability',
      'Excellent corrosion & chemical resistance',
      'Electrical insulation & thermal stability',
      'Lightweight, maintenance-free, easy installation'
    ],
    stats: [
      { value: '15+', label: 'Years Experience' },
      { value: '200+', label: 'Completed Projects' },
      { value: '100%', label: 'Client Satisfaction' }
    ]
  },
  aboutpage: {
    aboutText: 'Transpower is a globally leading group and one of the prominent names in Electro-Mechanical Industry. With over six decades of presence, Transpower has achieved consistent growth and built a reputable clientele. The company\'s unwavering commitment to learning, leadership, and innovation has secured its strong position in the Electro-Mechanical industry.',
    phone: '+91 98255 07517 / 37',
    emails: [
      'baroda@transpower.net.in',
      'sales@transpower.com',
      'frp@transpower.net.in'
    ],
    address: '346 GIDC, Makarpura, Vadodara - 390010, Gujarat (India)',
    groupCompanies: [
      { name: 'APIDEL', desc: 'Value Delivered', logo: '/assets/images/logo_apidel.jpg' },
      { name: 'SHREE RAJ', desc: 'Transpower Group of Companies', logo: '/assets/images/logo_shree_raj.jpg' },
      { name: 'TECHNO', desc: 'Techno Sales Agency', logo: '/assets/images/logo_techno.jpg' },
      { name: 'YASH', desc: 'Yash High Voltage', logo: '/assets/images/logo_yash.png' },
      { name: 'KAIVAL', desc: 'Kaival Poultry Farm', logo: '/assets/images/logo_kaival_poultry.png' }
    ]
  }
};

exports.getPage = async (req, res) => {
  const { key } = req.params;
  try {
    let doc = await PageContent.findOne({ key });
    if (!doc) {
      const defaultContent = DEFAULTS[key] || { overrides: {} };
      return res.json({ key, content: defaultContent });
    }
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePage = async (req, res) => {
  const { key } = req.params;
  const { content } = req.body;
  try {
    if (!content) {
      return res.status(400).json({ error: 'Content payload is required.' });
    }
    let doc = await PageContent.findOneAndUpdate(
      { key },
      { content },
      { new: true, upsert: true }
    );
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
