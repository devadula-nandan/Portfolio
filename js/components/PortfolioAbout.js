import { resumeData } from '../data.js';

export class PortfolioAbout extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const user = resumeData.user;
    this.innerHTML = `
      <section class="about-section" id="about">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">About Me</h2>
            <p class="section-subtitle">A brief introduction to my design philosophy and core values</p>
          </div>
          
          <div class="about-grid">
            <div class="about-text-content">
              <h3 class="about-heading">Crafting accessible and modular web experiences</h3>
              <p class="about-para">${user.description}</p>
              <p class="about-para">
                My primary focus revolves around building UI systems that excel in <strong>design consistency</strong>, 
                <strong>accessibility (A11y)</strong>, and <strong>usability</strong>. Through my work with IBM's Carbon Design System 
                and various web component frameworks, I focus on bridging the gap between pixel-perfect design assets and highly 
                efficient, clean code implementations.
              </p>
              
              <div class="about-bullet-points">
                <div class="bullet-item">
                  <span class="bullet-icon">✓</span>
                  <span>Modular React & Web Component architecture</span>
                </div>
                <div class="bullet-item">
                  <span class="bullet-icon">✓</span>
                  <span>Accessibility standards (WCAG, WAI-ARIA)</span>
                </div>
                <div class="bullet-item">
                  <span class="bullet-icon">✓</span>
                  <span>Automated unit and integration testing (Jest, Cypress)</span>
                </div>
                <div class="bullet-item">
                  <span class="bullet-icon">✓</span>
                  <span>Design-to-code workflow optimization</span>
                </div>
              </div>
            </div>
            
            <div class="about-stats-content">
              <div class="stats-grid">
                <div class="stat-card card">
                  <div class="stat-icon">💼</div>
                  <h4 class="stat-number">5+ Years</h4>
                  <p class="stat-label">UI Design & Dev Experience</p>
                </div>
                <div class="stat-card card">
                  <div class="stat-icon">🚀</div>
                  <h4 class="stat-number" id="about-repos-count">40+</h4>
                  <p class="stat-label">GitHub Repositories</p>
                </div>
                <div class="stat-card card">
                  <div class="stat-icon">👥</div>
                  <h4 class="stat-number" id="about-followers-count">15+</h4>
                  <p class="stat-label">GitHub Followers</p>
                </div>
                <div class="stat-card card">
                  <div class="stat-icon">🎯</div>
                  <h4 class="stat-number">IBM Carbon</h4>
                  <p class="stat-label">Design System Contribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('portfolio-about', PortfolioAbout);
