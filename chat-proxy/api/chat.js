import { setCorsHeaders } from '../lib/cors.js';

const GEMINI_MODEL = 'gemini-flash-lite-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MAX_MESSAGE_LENGTH = 500;

// This small model has near-total probability mass on one generic joke
// ("dark mode... light attracts bugs") — raising temperature alone doesn't
// dislodge it. Force variety ourselves by handing it a random topic to
// build the joke around whenever the message looks like a joke request.
const JOKE_REQUEST_PATTERN = /\bjoke|funny|laugh|humor|pun\b/i;
const JOKE_TOPICS = [
  'CSS specificity wars', 'JavaScript type coercion', 'npm install taking forever',
  'git merge conflicts', 'browser compatibility quirks', 'naming variables',
  'semicolons', 'React re-renders', 'centering a div', 'accessibility audits',
  'copy-pasting from Stack Overflow', 'code review comments', 'Monday morning deploys',
  'JSON parsing errors', 'infinite loops', 'CSS !important',
];

function buildUserContent(message) {
  if (!JOKE_REQUEST_PATTERN.test(message)) return message;
  const topic = JOKE_TOPICS[Math.floor(Math.random() * JOKE_TOPICS.length)];
  return `${message}\n\n(Make up a brand new joke specifically about "${topic}" — don't default to a generic dark-mode/bugs joke.)`;
}

const SYSTEM_PROMPT = `You are the virtual assistant embedded in Nandan Devadula's portfolio site. Answer questions about him in first person, as if you were speaking on his behalf, in a friendly and concise way (aim for under 60 words unless the question needs more).

About Nandan:
- Frontend Developer at IBM (Kochi, Kerala, India), working on the Carbon Design System team since Nov 2023 — building accessible, enterprise-grade Web Components for Carbon for IBM Products and Carbon for AI, prototyping in Carbon Labs, and doing WCAG accessibility testing (unit, E2E, automated).
- Previously: Software Engineer at HCL Technologies (Jun 2022 - Oct 2023) building financial dashboard UIs and integrating REST APIs; Web UI Developer at Ochre Media (Jul 2021 - May 2022) building B2B microsites.
- Education: B.E. in Electronics & Communication Engineering from Andhra University (Gayatri Vidya Parishad College), plus a Great Learning certificate in full-stack software development.
- Skills: JavaScript, TypeScript, HTML5, CSS/SCSS, React.js, Lit, Redux.js, Web Components, Carbon Design System, Tailwind CSS, Bootstrap, Jest, Cypress, Playwright, REST APIs, MySQL, Python.
- Has 40+ public GitHub repositories, including wc-audio-input, wc-resizer, and storybook-theme-carbon.
- Contact: devadula.nandan@gmail.com, +91 7032328703. GitHub: github.com/devadula-nandan. LinkedIn: linkedin.com/in/nandan-devadula.

You mainly talk about Nandan's professional background, skills, and how to contact him, but don't deflect casual or fun personal questions (favorite color, hobbies, etc.) — answer them naturally and in character, in a way that fits a frontend developer who likes clean design (e.g. his favorite color is the site's own neon cyan, #00f2fe). Only redirect if a question is truly inappropriate or unanswerable.`;

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const message = String(req.body?.message || '').slice(0, MAX_MESSAGE_LENGTH).trim();
  if (!message) {
    res.status(400).json({ error: 'Empty message' });
    return;
  }

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: { text: SYSTEM_PROMPT } },
        contents: [{ parts: [{ text: buildUserContent(message) }] }],
        // Higher temperature/topP/topK add variety for open-ended asks (jokes,
        // hobbies, etc.) — without this the model deterministically picks the
        // single most-likely reply every time (e.g. the same joke, always).
        generationConfig: { maxOutputTokens: 256, temperature: 1.4, topP: 0.97, topK: 64 },
      }),
    });

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.text();
      console.error('Gemini API call failed:', geminiRes.status, errorBody);
      res.status(502).json({ error: 'Upstream error' });
      return;
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || "Sorry, I couldn't come up with a response to that.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini API call failed:', err?.message);
    res.status(502).json({ error: 'Upstream error' });
  }
}
