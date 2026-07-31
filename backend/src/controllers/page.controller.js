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
    aboutText: '"Transpower" is a Globally Leading Group and is amongst the few leading names in Electro-Mechanical Industry. With a presence of more than 7 decades, Transpower has achieved a consistent growth and a reputed clientele. The constant zest to learn, lead and innovate has earned the company a strong position in the Electro-Mechanical Industry.',
    phone: '+91 98255 07517 / 37',
    emails: [
      'baroda@transpower.net.in',
      'sales@transpower.com',
      'frp@transpower.net.in'
    ],
    address: '346 GIDC, Makarpura, Vadodara - 390010, Gujarat (India)',
    groupCompanies: [
      { name: 'APIDEL', desc: 'Value Delivered' },
      { name: 'SHREE RAJ', desc: 'Transpower Group of Companies' },
      { name: 'TECHNO', desc: 'Techno Sales Agency' },
      { name: 'TRANSPOWER Exports', desc: 'International Trade Division' }
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
