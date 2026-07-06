import { resumeData } from '../data.js';

export class PortfolioHero extends HTMLElement {
  connectedCallback() {
    this.render();
    this.startTypingEffect();
  }

  render() {
    const user = resumeData.user;
    this.innerHTML = `
      <section class="hero-section" id="home">
        <div class="container hero-container">
          <div class="hero-content animate-fade-in">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span class="hero-badge-text">Open to Opportunities</span>
            </div>
            <h1 class="hero-title">
              Hi, I'm <span class="highlight-text">${user.firstName} ${user.lastName}</span>
            </h1>
            <h2 class="hero-subtitle">
              A <span id="typing-text"></span><span class="typing-cursor"></span>
            </h2>
            <p class="hero-description">
              ${user.description}
            </p>
            <div class="hero-ctas">
              <a href="#contact" class="btn btn-primary">
                Get In Touch
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="${user.cv}" target="_blank" class="btn btn-secondary">
                View Resume (CV)
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>
            </div>
            <div class="hero-socials">
              <a href="${user.social.github}" target="_blank" class="btn-icon" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="${user.social.linkedin}" target="_blank" class="btn-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="${user.social.instagram}" target="_blank" class="btn-icon" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          <div class="hero-image-container animate-fade-in">
            <div class="hero-image-wrapper">
              <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" class="hero-profile-img" />
            </div>
          </div>
          </div>
        </div>
      </section>
    `;
  }

  startTypingEffect() {
    const user = resumeData.user;
    const titles = user.titles || ["Frontend Developer", "Web Components Engineer", "Carbon Design System Contributor"];
    const typingSpan = this.querySelector('#typing-text');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        typingSpan.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingSpan.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before next
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }
}

customElements.define('portfolio-hero', PortfolioHero);
