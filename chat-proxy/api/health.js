// Cheap reachability/config check for the About chat widget's status
// indicator — never calls Gemini, so it costs nothing and returns instantly.
const ALLOWED_ORIGINS = new Set([
  'https://nandan-dev.com',
  'https://devadula-nandan.github.io',
  'http://localhost:3000',
]);

export default function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.status(200).json({ ok: Boolean(process.env.GOOGLE_API_KEY) });
}
