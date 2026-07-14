const { setCorsHeaders } = require('../lib/cors.js');

// Available models ordered from highest to lowest quality
const MODELS_HIERARCHY = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];

// Helper to determine the fallback chain based on preferred model
function getFallbackChain(preferredModel) {
  const chain = [];
  const idx = MODELS_HIERARCHY.indexOf(preferredModel);
  if (idx !== -1) {
    for (let i = idx; i < MODELS_HIERARCHY.length; i++) {
      chain.push(MODELS_HIERARCHY[i]);
    }
  } else {
    // Default fallback starting point if preferred model is not matched
    chain.push('gemini-3.1-flash-lite');
  }

  // Ensure ultimate fallbacks are included
  const ultimateFallbacks = ['gemini-flash-lite-latest', 'gemini-flash-latest'];
  for (const model of ultimateFallbacks) {
    if (!chain.includes(model)) {
      chain.push(model);
    }
  }
  return chain;
}

const MAX_MSG_LENGTH = 500; // per message
const MAX_TURNS = 12;        // most recent messages kept for context

const SYSTEM_PROMPT = `You are Nandan Devadula's assistant on his personal portfolio site. You speak AS Nandan, in the first person, chatting with a visitor.

Voice and behavior:
- Warm, natural, and conversational — like a friendly professional replying in a chat, not reciting a résumé.
- Keep replies short: usually 1–3 sentences. Expand only when the question genuinely needs it.
- Vary your phrasing. Don't open every reply the same way, and never re-introduce yourself or repeat the greeting once the conversation is underway.
- Use the conversation so far for context: build on what was already asked, refer back to it naturally, and resolve follow-ups like "and before that?" or "why?" against earlier turns. A brief follow-up question of your own is welcome when it fits.
- Write in plain text only — no markdown, bullet characters, or asterisks.

About Nandan:
- Frontend Developer at IBM (Kochi, Kerala, India), on the Carbon Design System team since Nov 2023 — building accessible, enterprise-grade Web Components for Carbon for IBM Products and Carbon for AI, prototyping in Carbon Labs, and doing WCAG accessibility testing (unit, E2E, automated).
- Previously: Software Engineer at HCL Technologies (Jun 2022 – Oct 2023) building financial dashboard UIs and integrating REST APIs; Web UI Developer at Ochre Media (Jul 2021 – May 2022) building B2B microsites.
- Education: B.E. in Electronics & Communication Engineering from Andhra University (Gayatri Vidya Parishad College), plus a Great Learning certificate in full-stack software development.
- Skills: JavaScript, TypeScript, HTML5, CSS/SCSS, React.js, Lit, Redux.js, Web Components, Carbon Design System, Tailwind CSS, Bootstrap, Jest, Cypress, Playwright, REST APIs, MySQL, Python.
- 40+ public GitHub repositories, including wc-audio-input, wc-resizer, and storybook-theme-carbon.
- Contact: devadula.nandan@gmail.com, +91 7032328703. GitHub: github.com/devadula-nandan. LinkedIn: linkedin.com/in/nandan-devadula.

Stay mostly on Nandan's work, skills, and how to reach him, but answer casual or personal questions naturally and in character (e.g. favorite color is Carbon blue, #0f62fe). If something is genuinely unknown or off-limits, say so briefly and steer back — never invent specifics.`;

// Normalize whatever the client sent into Gemini's `contents` format.
// Accepts the new { messages: [{role, content}, ...] } or the legacy { message: "..." }.
function buildContents(body) {
  const raw = Array.isArray(body?.messages)
    ? body.messages
    : body?.message
      ? [{ role: 'user', content: body.message }]
      : [];

  const contents = raw
    .map((m) => {
      const role =
        m && (m.role === 'assistant' || m.role === 'model' || m.role === 'bot')
          ? 'model'
          : 'user';
      const text = String(m?.content ?? m?.text ?? '')
        .slice(0, MAX_MSG_LENGTH)
        .trim();
      return text ? { role, parts: [{ text }] } : null;
    })
    .filter(Boolean)
    .slice(-MAX_TURNS);

  // Gemini requires the conversation to begin with a user turn.
  while (contents.length && contents[0].role !== 'user') contents.shift();
  return contents;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const contents = buildContents(req.body);
  if (!contents.length) {
    res.status(400).json({ error: 'Empty message' });
    return;
  }

  let reply = null;
  let modelUsed = null;
  let lastError = null;
  const rateLimitedModels = [];

  const fallbackChain = getFallbackChain(req.body?.preferredModel);

  for (const model of fallbackChain) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
      console.log(`Attempting chat generation with model: ${model}`);
      const geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: { text: SYSTEM_PROMPT } },
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.75, topP: 0.9 },
        }),
      });

      if (geminiRes.status === 429 || geminiRes.status === 403) {
        const errorBody = await geminiRes.text();
        console.warn(`Model ${model} rate-limited or quota exceeded (status ${geminiRes.status}): ${errorBody}. Trying next fallback...`);
        lastError = { status: geminiRes.status, body: errorBody };
        rateLimitedModels.push(model);
        continue;
      }

      if (!geminiRes.ok) {
        const errorBody = await geminiRes.text();
        console.warn(`Model ${model} failed with status ${geminiRes.status}: ${errorBody}. Trying next fallback...`);
        lastError = { status: geminiRes.status, body: errorBody };
        rateLimitedModels.push(model);
        continue;
      }

      const data = await geminiRes.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        reply = generatedText;
        modelUsed = model;
        break; // Success!
      } else {
        console.warn(`Model ${model} returned empty response candidates. Trying next fallback...`);
        lastError = { status: 200, body: 'No candidates returned' };
        rateLimitedModels.push(model);
      }
    } catch (err) {
      console.error(`Error executing model ${model}:`, err?.message);
      lastError = { status: 500, body: err?.message };
      rateLimitedModels.push(model);
    }
  }

  if (!reply) {
    console.error('All models in the fallback chain failed.');
    res.status(lastError?.status || 502).json({
      error: 'All Gemini models exhausted',
      details: lastError?.body || 'Unknown error'
    });
    return;
  }

  res.status(200).json({ reply, modelUsed, rateLimitedModels });
};
