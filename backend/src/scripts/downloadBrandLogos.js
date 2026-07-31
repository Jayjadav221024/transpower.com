process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS = {
  brand_siemens: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/320px-Siemens-logo.svg.png',
  brand_rotomotive: 'https://www.rotomotive.com/wp-content/uploads/2021/04/Rotomotive-Logo.png',
  brand_crompton: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/CG_Power_and_Industrial_Solutions_logo.png',
  brand_innomotics: 'https://companieslogo.com/img/orig/INNOM.DE_BIG-a0e28f09.png',
  brand_hindustan: 'https://www.hindustanelectric.com/images/logo.png'
};

const destDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(name, url) {
  const ext = '.png';
  const filePath = path.join(destDir, `${name}${ext}`);
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${name} successfully!`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${name}:`, err.message);
  });
}

Object.entries(LOGOS).forEach(([name, url]) => {
  download(name, url);
});
