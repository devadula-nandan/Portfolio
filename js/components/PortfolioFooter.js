import { resumeData } from '../data.js';

export class PortfolioFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const year = new Date().getFullYear();
    const user = resumeData.user;
    this.innerHTML = `
      <footer class="portfolio-footer">
        <div class="container footer-container">
          <div class="footer-text">
            &copy; ${year} ${user.firstName} ${user.lastName}. All rights reserved.
          </div>
          
          <div class="footer-text">
            Built using Vanilla Web Components &amp; <span class="highlight-text">data.js</span>
          </div>
          
          <div class="footer-socials">
            <a href="${user.social.github}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="GitHub">
              <i data-lucide="github"></i>
            </a>
            <a href="${user.social.linkedin}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="LinkedIn">
              <i data-lucide="linkedin"></i>
            </a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('portfolio-footer', PortfolioFooter);
