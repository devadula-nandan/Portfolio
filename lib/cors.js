const STATIC_ALLOWED_ORIGINS = new Set([
  'https://nandan-dev.com',
  'https://devadula-nandan.github.io',
  'http://localhost:3000',
]);

// Matches http://<private-LAN-ip>:<port> so the widget also works when
// testing from a phone on the same Wi-Fi as the dev machine — the LAN IP
// changes across networks/DHCP leases, so a fixed allow-list entry won't do.
const LOCAL_NETWORK_ORIGIN = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):\d+$/;

function isAllowedOrigin(origin) {
  return STATIC_ALLOWED_ORIGINS.has(origin) || 
         LOCAL_NETWORK_ORIGIN.test(origin) || 
         /^http:\/\/localhost(:\d+)?$/.test(origin);
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = { isAllowedOrigin, setCorsHeaders };
