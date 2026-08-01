const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`${url} -> Status Code: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(`${url} -> Error: ${err.message}`);
      resolve(500);
    });
  });
}

async function run() {
  const images = [
    '/assets/images/hero_frp_grating.png',
    '/assets/images/cable_tray_product.png',
    '/assets/images/gearboxes_product.webp',
    '/assets/images/switchgears_product.webp',
    '/assets/images/industrial_walkway.png'
  ];
  for (const img of images) {
    await checkUrl(`http://localhost:5173${img}`);
    await checkUrl(`http://localhost:5000${img}`);
  }
}

run();
