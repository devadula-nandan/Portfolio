import { resumeData } from '../data.js';

export class PortfolioHero extends HTMLElement {
  connectedCallback() {
    this.render();
    this.startTypingEffect();
    this.startAmoebaMorph();
  }

  disconnectedCallback() {
    if (this.amoebaInterval) {
      clearInterval(this.amoebaInterval);
    }
  }

  render() {
    const user = resumeData.user;
    this.innerHTML = `
      <section class="hero-section" id="home">
        <div class="container hero-container">
          <div class="hero-content animate-fade-in">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span class="hero-badge-text">${user.titles?.[0] || 'Frontend Developer'}</span>
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
                <i data-lucide="arrow-right"></i>
              </a>
              <a href="${user.cv}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                View Resume
                <i data-lucide="download"></i>
              </a>
            </div>
            
            <div class="hero-socials">
              <a href="${user.social.github}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="GitHub">
                <i data-lucide="github"></i>
              </a>
              <a href="${user.social.linkedin}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="LinkedIn">
                <i data-lucide="linkedin"></i>
              </a>
              <a href="${user.social.instagram}" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="Instagram">
                <i data-lucide="instagram"></i>
              </a>
            </div>
          </div>
          
          <div class="hero-image-container animate-fade-in">
            <div class="hero-image-wrapper">
              <img src="${user.avatar}" alt="Portrait of ${user.firstName} ${user.lastName}" class="hero-profile-img" width="320" height="320" fetchpriority="high" />
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
    if (!typingSpan) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typingSpan.textContent = titles[0];
      return;
    }

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
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
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    };

    setTimeout(type, 800);
  }

  startAmoebaMorph() {
    const wrapper = this.querySelector('.hero-image-wrapper');
    const img = this.querySelector('.hero-profile-img');
    if (!wrapper || !img) return;

    const getRandomRadius = () => {
      // Morph adjacent corners to sum to exactly 100%, removing straight lines.
      const r = () => Math.floor(Math.random() * 25) + 38; // 38% to 63%
      const tl_h = r();
      const tr_h = 100 - tl_h;
      const bl_h = r();
      const br_h = 100 - bl_h;

      const tl_v = r();
      const bl_v = 100 - tl_v;
      const tr_v = r();
      const br_v = 100 - tr_v;

      return `${tl_h}% ${tr_h}% ${br_h}% ${bl_h}% / ${tl_v}% ${tr_v}% ${br_v}% ${bl_v}%`;
    };

    const morph = () => {
      const radius = getRandomRadius();
      wrapper.style.borderRadius = radius;
      img.style.borderRadius = radius;
    };

    // Set initial custom shape and start interval
    morph();
    this.amoebaInterval = setInterval(morph, 2200);
  }
}

customElements.define('portfolio-hero', PortfolioHero);
