# Nandan Devadula — Portfolio

Personal portfolio website of **Nandan Devadula**, Frontend Developer at IBM (Carbon Design System).

**Live site:** https://devadula-nandan.github.io/Portfolio/

## Highlights

- **Zero-framework architecture** — built entirely with native **Web Components** (custom elements), vanilla JavaScript ES modules, and modern CSS. No build step, no bundler, no dependencies to install.
- **Live GitHub data** — profile, repositories, language stats, and the contribution calendar are fetched from the GitHub API at runtime, with graceful fallback to static data in [`js/data.js`](js/data.js) when offline or rate-limited.
- **Single source of truth** — personal data (experience, skills, links) is parsed from a JSON blob embedded in the [GitHub profile README](https://github.com/devadula-nandan/devadula-nandan), so the portfolio updates without redeploying.
- **Blueprint design system** — a custom "CAD schematic" aesthetic with extended blueprint borders, a precision crosshair cursor, and light/dark themes.
- **Accessible & responsive** — keyboard-visible focus states, `prefers-reduced-motion` and `prefers-color-scheme` support, semantic landmarks, and mobile navigation.

## Project structure

```
├── index.html              # Entry point, SEO/meta, custom element mounts
├── index.css               # Full design system (themes, components, animations)
├── server.js               # Zero-dependency local dev server
└── js/
    ├── app.js              # Component registration + global interactions
    ├── api.js              # GitHub API / profile README data layer (memoized)
    ├── data.js             # Static fallback data (mirrors profile README JSON)
    └── components/         # One class per section (header, hero, skills, ...)
```

## Run locally

Requires only [Node.js](https://nodejs.org) (any recent version — no packages needed):

```bash
node server.js
# → http://localhost:3000
```

Or use any static file server (`npx serve`, VS Code Live Server, etc.) — it's a fully static site.

## Deployment

Deployed with GitHub Pages from the repository root. Any push to `main` updates the live site.
