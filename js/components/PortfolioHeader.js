export class PortfolioHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initTheme();
    this.setupListeners();
  }

  render() {
    this.innerHTML = `
      <header class="portfolio-header">
        <div class="container header-container">
          <a href="#home" class="logo" aria-label="Back to top">
            <span class="logo-text">Nandan.D</span>
          </a>
          
          <nav class="nav-menu" id="nav-menu">
            <ul class="nav-list">
              <li><a href="#about" class="nav-link">About</a></li>
              <li><a href="#skills" class="nav-link">Skills</a></li>
              <li><a href="#experience" class="nav-link">Experience</a></li>
              <li><a href="#projects" class="nav-link">Projects</a></li>
              <li><a href="#github" class="nav-link">GitHub</a></li>
              <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
          </nav>

          <div class="header-actions">
            <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle Theme">
              <!-- Sun Icon -->
              <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <!-- Moon Icon -->
              <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            
            <button class="mobile-menu-toggle" id="mobile-toggle" aria-label="Toggle Menu" aria-expanded="false" aria-controls="nav-menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  initTheme() {
    // Saved preference wins; otherwise follow the OS color scheme
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const savedTheme = localStorage.getItem('portfolio-theme') || systemTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeUI(savedTheme);
  }

  updateThemeUI(theme) {
    const toggleBtn = this.querySelector('#theme-toggle');
    toggleBtn.classList.toggle('light-active', theme === 'light');
    toggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#0a0e17');
    }
  }

  setupListeners() {
    const themeBtn = this.querySelector('#theme-toggle');
    const mobileToggle = this.querySelector('#mobile-toggle');
    const navMenu = this.querySelector('#nav-menu');
    const navLinks = this.querySelectorAll('.nav-link');

    // Theme toggle
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      this.updateThemeUI(newTheme);
      // Notify components that render theme-dependent assets
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    });

    const closeMenu = () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      mobileToggle.setAttribute('aria-expanded', 'false');
    };

    // Mobile menu toggle
    mobileToggle.addEventListener('click', (e) => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      e.stopPropagation(); // Avoid immediately triggering click-outside
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on click outside the header menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Keyboard navigation handlers (Escape to close, Tab to trap focus)
    document.addEventListener('keydown', (e) => {
      if (!navMenu.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeMenu();
        mobileToggle.focus();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = [mobileToggle, themeBtn, ...Array.from(navLinks)];
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Add border scroll effect
    window.addEventListener('scroll', () => {
      const header = this.querySelector('.portfolio-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

customElements.define('portfolio-header', PortfolioHeader);
