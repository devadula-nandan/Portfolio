import Anthropic from '@anthropic-ai/sdk';

const ALLOWED_ORIGINS = new Set([
  'https://nandan-dev.com',
  'https://devadula-nandan.github.io',
  'http://localhost:3000',
]);

const MAX_MESSAGE_LENGTH = 500;

const SYSTEM_PROMPT = `You are the virtual assistant embedded in Nandan Devadula's portfolio site. Answer questions about him in first person, as if you were speaking on his behalf, in a friendly and concise way (aim for under 60 words unless the question needs more).

About Nandan:
- Frontend Developer at IBM (Kochi, Kerala, India), working on the Carbon Design System team since Nov 2023 — building accessible, enterprise-grade Web Components for Carbon for IBM Products and Carbon for AI, prototyping in Carbon Labs, and doing WCAG accessibility testing (unit, E2E, automated).
- Previously: Software Engineer at HCL Technologies (Jun 2022 - Oct 2023) building financial dashboard UIs and integrating REST APIs; Web UI Developer at Ochre Media (Jul 2021 - May 2022) building B2B microsites.
- Education: B.E. in Electronics & Communication Engineering from Andhra University (Gayatri Vidya Parishad College), plus a Great Learning certificate in full-stack software development.
- Skills: JavaScript, TypeScript, HTML5, CSS/SCSS, React.js, Lit, Redux.js, Web Components, Carbon Design System, Tailwind CSS, Bootstrap, Jest, Cypress, Playwright, REST APIs, MySQL, Python.
- Has 40+ public GitHub repositories, including wc-audio-input, wc-resizer, and storybook-theme-carbon.
- Contact: devadula.nandan@gmail.com, +91 7032328703. GitHub: github.com/devadula-nandan. LinkedIn: linkedin.com/in/nandan-devadula.

Only answer questions related to Nandan's professional background, skills, and how to contact him. For unrelated questions, briefly redirect to what you can help with.`;

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

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
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.content.find((block) => block.type === 'text')?.text
      || "Sorry, I couldn't come up with a response to that.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Anthropic API call failed:', err?.status, err?.message);
    res.status(502).json({ error: 'Upstream error' });
  }
}
