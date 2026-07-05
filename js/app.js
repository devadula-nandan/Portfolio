// Import and register all Web Components
import './components/PortfolioHeader.js';
import './components/PortfolioHero.js';
import './components/PortfolioAbout.js';
import './components/PortfolioSkills.js';
import './components/PortfolioExperience.js';
import './components/PortfolioProjects.js';
import './components/GithubStats.js';
import './components/PortfolioContact.js';
import './components/PortfolioFooter.js';

// Global Console Greeting
console.log(
  '%c ⚛️ Nandan Devadula - Portfolio App Initialized %c',
  'background: #00f2fe; color: #0a0e17; padding: 4px 8px; font-weight: bold; border-radius: 4px;',
  'background: transparent; color: inherit;'
);

// Global Interactive Visual Animations
document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const scrollBar = document.getElementById('scroll-bar');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // 2. Dynamic Mouse-Following Glow Effect
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    
    // Smooth interpolation factor (lag speed)
    const speed = 0.08;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseGlow.classList.add('visible');
    }, { passive: true });

    const updateGlowPosition = () => {
      glowX += (mouseX - glowX) * speed;
      glowY += (mouseY - glowY) * speed;
      
      // Offset by half of glow width (300px / 2 = 150px) to center on cursor
      mouseGlow.style.transform = `translate3d(${glowX - 150}px, ${glowY - 150}px, 0)`;
      
      requestAnimationFrame(updateGlowPosition);
    };
    
    updateGlowPosition();
  }
  // 3. Precision CAD Crosshair Cursor
  const precisionCursor = document.getElementById('precision-cursor');
  const crosshairCoords = document.getElementById('crosshair-coords');
  if (precisionCursor && crosshairCoords) {
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      precisionCursor.classList.add('visible');
      precisionCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      crosshairCoords.innerHTML = `X: ${Math.round(e.clientX)}px<br>Y: ${Math.round(e.clientY)}px`;

      // Check if hovering over clickable or interactive element
      const target = e.target;
      if (target && (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('.btn') || 
        target.closest('.btn-icon') ||
        target.closest('.filter-btn') || 
        target.closest('.timeline-tab-btn') || 
        target.closest('.nav-link') ||
        target.closest('.theme-toggle-btn')
      )) {
        precisionCursor.classList.add('hovering');
      } else {
        precisionCursor.classList.remove('hovering');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      precisionCursor.classList.remove('visible');
    });
  }

  // 4. Randomize Blueprint Border Protrusion Lengths (Hand-drawn schematic effect)
  const BLUEPRINT_SELECTOR = '.card, .project-card, .timeline-card, .widget-fallback-card, .contact-detail-card, .hero-badge, .btn, .filter-btn, .hero-image-wrapper';

  const randomizeElementBorders = (el) => {
    const rand = () => Math.floor(Math.random() * 25) + 8; // 8–32px
    el.style.setProperty('--extend-left',   `${rand()}px`);
    el.style.setProperty('--extend-right',  `${rand()}px`);
    el.style.setProperty('--extend-top',    `${rand()}px`);
    el.style.setProperty('--extend-bottom', `${rand()}px`);
  };

  // Set initial random values for all existing elements
  document.querySelectorAll(BLUEPRINT_SELECTOR).forEach(randomizeElementBorders);

  // Delegated mouseover — works for dynamically-rendered cards too.
  // mouseover bubbles, so one listener on body covers everything.
  let lastHovered = null;
  document.body.addEventListener('mouseover', (e) => {
    const el = e.target.closest(BLUEPRINT_SELECTOR);
    if (el && el !== lastHovered) {
      lastHovered = el;
      randomizeElementBorders(el);
    }
    if (!el) lastHovered = null;
  }, { passive: true });

  // Re-randomize all when filter/tab/theme buttons are clicked (cards may reorder)
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.filter-btn') || e.target.closest('.timeline-tab-btn') || e.target.closest('.theme-toggle-btn')) {
      setTimeout(() => {
        document.querySelectorAll(BLUEPRINT_SELECTOR).forEach(randomizeElementBorders);
      }, 80);
    }
  });
});
