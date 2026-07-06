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
          <div class="footer-logo">
            <span class="logo-text">${user.firstName}.${user.lastName.charAt(0)}</span>
          </div>
          
          <p class="footer-copy">
            &copy; ${year} ${user.firstName} ${user.lastName}. All Rights Reserved.
          </p>
          
          <p class="footer-credits">
            Built with <i data-lucide="zap" class="footer-zap"></i> Vanilla Web Components, CSS3 Grid/Flexbox & GitHub API.
          </p>
          
          <a href="#" class="back-to-top" aria-label="Scroll back to top">
            <i data-lucide="arrow-up"></i>
          </a>
        </div>
      </footer>
    `;
  }
}

customElements.define('portfolio-footer', PortfolioFooter);
