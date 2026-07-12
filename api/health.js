// Cheap reachability/config check for the About chat widget's status
// indicator — never calls Gemini, so it costs nothing and returns instantly.
const { isAllowedOrigin } = require('../lib/cors.js');

module.exports = function handler(req, res) {
  const origin = req.headers.origin || '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.status(200).json({ ok: Boolean(process.env.GOOGLE_API_KEY) });
}
