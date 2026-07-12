// <mc-avatar> — animated Minecraft pixel avatar (8x8 grid) that morphs
// between Steve and a Creeper head.
// Adapted from Uiverse.io by BlackisPlay, refactored into a data-driven
// Shadow DOM component so it can be reused without ID collisions.
//
// Usage:
//   <mc-avatar></mc-avatar>            -> default 200px
//   <mc-avatar size="120"></mc-avatar> -> 120px
//   or style with: mc-avatar { --mc-avatar-size: 300px; }

// Base skin colors, rows top-to-bottom, left-to-right (64 cells)
const SKIN = [
  '#2f200d', '#2b1e0d', '#2f1f0f', '#281c0b', '#241808', '#261a0a', '#2b1e0d', '#2a1d0d',
  '#2b1e0d', '#2b1e0d', '#2b1e0d', '#332411', '#422a12', '#3f2a15', '#2c1e0e', '#281c0b',
  '#2b1e0d', '#b6896c', '#bd8e72', '#c69680', '#bd8b72', '#bd8e74', '#ac765a', '#342512',
  '#aa7d66', '#b4846d', '#aa7d66', '#ad806d', '#9c725c', '#bb8972', '#9c694c', '#9c694c',
  '#b4846d', '#ffffff', '#523d89', '#b57b67', '#bb8972', '#523d89', '#ffffff', '#aa7d66',
  '#9c6346', '#b37b62', '#b78272', '#6a4030', '#6a4030', '#be886c', '#a26a47', '#805334',
  '#905e43', '#965f40', '#41210c', '#8a4c3d', '#8a4c3d', '#45220e', '#8f5e3e', '#815339',
  '#6f452c', '#6d432a', '#41210c', '#421d0a', '#45220e', '#45220e', '#83553b', '#7a4e33',
];

// Creeper head overlay that sweeps over each cell (64 cells) — the avatar
// periodically morphs from Steve into a Creeper and back
const OVERLAY = [
  '#4fae3f', '#58bd48', '#4aa53c', '#61c751', '#55b846', '#4fae3f', '#45a037', '#5cc24d',
  '#58bd48', '#4aa53c', '#52b442', '#47a839', '#5fc450', '#4fae3f', '#58bd48', '#49aa3b',
  '#45a037', '#1e1e1e', '#171717', '#52b442', '#5cc24d', '#1a1a1a', '#202020', '#4aa53c',
  '#55b846', '#141414', '#1d1d1d', '#4fae3f', '#47a839', '#191919', '#131313', '#58bd48',
  '#4aa53c', '#5cc24d', '#52b442', '#1b1b1b', '#161616', '#4fae3f', '#45a037', '#61c751',
  '#58bd48', '#4fae3f', '#181818', '#101010', '#151515', '#1c1c1c', '#52b442', '#4aa53c',
  '#45a037', '#55b846', '#131313', '#1a1a1a', '#0f0f0f', '#171717', '#5fc450', '#4fae3f',
  '#52b442', '#4aa53c', '#1e1e1e', '#47a839', '#55b846', '#121212', '#4fae3f', '#58bd48',
];

// Eye cells (white + purple iris) that blink with a skin-colored eyelid
const EYES = new Set([33, 34, 37, 38]);
const EYELID_COLOR = '#a17661';

export class McAvatar extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  connectedCallback() {
    if (!this.shadowRoot) this.render();
    this.applySize();
  }

  attributeChangedCallback() {
    this.applySize();
  }

  applySize() {
    const size = this.getAttribute('size');
    if (size) this.style.setProperty('--mc-avatar-size', `${parseInt(size, 10)}px`);
  }

  render() {
    const shadow = this.attachShadow({ mode: 'open' });

    const cells = SKIN.map((color, i) => `
      <div class="px${EYES.has(i) ? ' eye' : ''}"
           style="--c:${color}; --o:${OVERLAY[i]}; --d:${(i * 0.01).toFixed(2)}s"></div>
    `).join('');

    shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: var(--mc-avatar-size, 200px);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          width: 100%;
          aspect-ratio: 1 / 1;
        }
        .px {
          position: relative;
          overflow: hidden;
          background-color: var(--c);
        }
        /* Creeper block that periodically sweeps down over the cell.
           Anchored at inset:0 and hidden by translateY(-102%): when shown it
           aligns exactly with the cell, and the 2% overshoot when hidden
           absorbs sub-pixel rounding at small sizes (a -100% resting offset
           leaks a sliver of overlay when cells have fractional heights). */
        .px::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: var(--o);
          transform: translateY(-102%);
          animation: sweep 6s ease-in-out infinite var(--d);
        }
        .eye::before {
          z-index: 2;
        }
        /* Skin-colored eyelid that drops for the blink */
        .eye::after {
          content: "";
          position: absolute;
          inset: 0;
          background-color: ${EYELID_COLOR};
          z-index: 1;
          transform: translateY(-102%);
          animation: blink 6s ease-in-out infinite 2s;
        }
        @keyframes sweep {
          0%   { transform: translateY(-102%); }
          5%   { transform: translateY(0); }
          50%  { transform: translateY(0); }
          55%  { transform: translateY(-102%); }
          100% { transform: translateY(-102%); }
        }
        @keyframes blink {
          0%, 40%  { transform: translateY(-102%); }
          45%, 48% { transform: translateY(0); }
          53%, 100% { transform: translateY(-102%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .px::before, .eye::after { animation: none; }
        }
      </style>
      <div class="grid" role="img" aria-label="Pixel art Minecraft avatar morphing between Steve and a Creeper">${cells}</div>
    `;
  }
}

customElements.define('mc-avatar', McAvatar);
