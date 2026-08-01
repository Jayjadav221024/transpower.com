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
  await checkUrl('http://localhost:5173/assets/images/hero_frp_grating.png');
  await checkUrl('http://localhost:5000/assets/images/hero_frp_grating.png');
}

run();
