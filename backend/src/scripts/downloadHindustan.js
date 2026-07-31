process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const destDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'assets', 'images');
const filePath = path.join(destDir, 'brand_hindustan.png');

function download(url, destPath) {
  const client = url.startsWith('https') ? https : http;
  client.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      console.log(`Redirecting to: ${res.headers.location}`);
      download(res.headers.location, destPath);
      return;
    }
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded brand_hindustan successfully!');
      });
    } else {
      console.error(`Failed with status: ${res.statusCode} for ${url}`);
    }
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
}

download('https://www.hindmotors.com/images/logo.png', filePath);
