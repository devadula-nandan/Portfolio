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
          <a href="#" class="logo">
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
            
            <button class="mobile-menu-toggle" id="mobile-toggle" aria-label="Toggle Menu">
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
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeUI(savedTheme);
  }

  updateThemeUI(theme) {
    const toggleBtn = this.querySelector('#theme-toggle');
    if (theme === 'light') {
      toggleBtn.classList.add('light-active');
    } else {
      toggleBtn.classList.remove('light-active');
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
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
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
