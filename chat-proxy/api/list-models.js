// Temporary diagnostic endpoint — lists models this API key can actually call.
// Deleted once the real model ID is confirmed.
export default async function handler(req, res) {
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`
  );
  const data = await upstream.json();
  const names = (data.models || [])
    .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map((m) => m.name);
  res.status(upstream.status).json({ names, raw: upstream.ok ? undefined : data });
}
