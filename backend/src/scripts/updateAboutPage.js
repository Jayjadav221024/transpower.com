require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const PageContent = require('../models/PageContent');

const newContent = {
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
  ],
  leaderImg1: '/assets/images/hemant_patel.png',
  leaderName1: 'Mr. Hemant Patel',
  leaderRole1: 'Director',
  leaderQuote1: '"Transpower\'s success is rooted in our unwavering commitment to excellence, innovation and customer satisfaction. With a dedicated workforce and cutting-edge technology, we continue to lead the Electro-Mechanical industry globally. Our goal is to provide an exceptional experience for our customers, ensuring joy and satisfaction in every interaction."',
  leaderImg2: '/assets/images/kiran_parekh.png',
  leaderName2: 'Mr. Kiran Parekh',
  leaderRole2: 'General Manager',
  leaderQuote2: '"As a General Manager, I am honored to lead a professional team that is dedicated to the company\'s vision & mission. Our commitment to excellence drives everything we do, from delivering outstanding products and services to providing exceptional customer support. We believe in fostering a culture of integrity, teamwork, innovation & excellence within our organization. This culture not only empowers our employees but also ensures that we consistently exceed our customers\' expectations. Thank you for your interest in our organization. We look forward to the opportunity to serve you better."'
};

(async () => {
  await connectDB();
  await PageContent.findOneAndUpdate(
    { key: 'aboutpage' },
    { content: newContent },
    { new: true, upsert: true }
  );
  console.log('Successfully updated aboutpage database overrides!');
  await mongoose.disconnect();
})();
