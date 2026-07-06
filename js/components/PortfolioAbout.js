import { resumeData } from '../data.js';

export class PortfolioAbout extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const user = resumeData.user;
    const highlights = user.highlights;

    const highlightIcons = ['briefcase', 'rocket', 'users', 'target'];

    const statsHTML = highlights.map((h, i) => `
      <div class="stat-card card">
        <div class="stat-icon"><i data-lucide="${highlightIcons[i % highlightIcons.length]}"></i></div>
        <h4 class="stat-number" ${i === 2 ? 'id="about-repos-count"' : ''}>${h.label}</h4>
        <p class="stat-label">${h.sublabel}</p>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="about-section" id="about">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">About Me</h2>
            <p class="section-subtitle">A brief introduction to my design philosophy and core values</p>
          </div>
          
          <div class="about-grid">
            <div class="about-text-content">
              <h3 class="about-heading">Crafting accessible, enterprise-grade web experiences</h3>
              <p class="about-para">${user.description}</p>
              <p class="about-para">
                My primary focus is building UI systems that excel in <strong>design consistency</strong>,
                <strong>accessibility (A11y)</strong>, and <strong>usability</strong>. Through my work on IBM's
                Carbon Design System — used by hundreds of IBM products globally — I bridge the gap between
                pixel-perfect design assets and highly efficient, clean code implementations.
              </p>
              
              <div class="about-bullet-points">
                <div class="bullet-item">
                  <i data-lucide="check" class="bullet-icon"></i>
                  <span>Modular Web Component & React architecture</span>
                </div>
                <div class="bullet-item">
                  <i data-lucide="check" class="bullet-icon"></i>
                  <span>Accessibility standards (WCAG 2.1, WAI-ARIA)</span>
                </div>
                <div class="bullet-item">
                  <i data-lucide="check" class="bullet-icon"></i>
                  <span>Automated testing (Jest, Cypress, Playwright)</span>
                </div>
                <div class="bullet-item">
                  <i data-lucide="check" class="bullet-icon"></i>
                  <span>Enterprise design systems & component libraries</span>
                </div>
              </div>
            </div>
            
            <div class="about-stats-content">
              <div class="stats-grid">
                ${statsHTML}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('portfolio-about', PortfolioAbout);
