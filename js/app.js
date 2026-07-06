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
    const updateScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollBar.style.width = scrolled + '%';
      scrollBar.style.opacity = scrolled > 0.5 ? '1' : '0';
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
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
  const BLUEPRINT_SELECTOR = '.card, .project-card, .timeline-card, .widget-fallback-card, .contact-detail-card, .hero-badge, .btn, .filter-btn, .hero-image-wrapper, .nav-link, .skills-search-wrapper, .timeline-dot';

  const randomizeElementBorders = (el) => {
    if (el.dataset.protrusionsSet) return;
    const rand = () => Math.floor(Math.random() * 25) + 8; // 8–32px
    el.style.setProperty('--extend-left',   `${rand()}px`);
    el.style.setProperty('--extend-right',  `${rand()}px`);
    el.style.setProperty('--extend-top',    `${rand()}px`);
    el.style.setProperty('--extend-bottom', `${rand()}px`);
    el.dataset.protrusionsSet = 'true';
  };

  // Set initial random values for all existing elements
  document.querySelectorAll(BLUEPRINT_SELECTOR).forEach(randomizeElementBorders);

  // 5. Active Section Scroll Spy (Intersection Observer)
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  });

  document.querySelectorAll('section[id]').forEach(section => {
    spyObserver.observe(section);
  });

  // Watch for dynamic elements added to the DOM (like async projects and replaced sections)
  new MutationObserver((mutations) => {
    document.querySelectorAll(BLUEPRINT_SELECTOR).forEach(randomizeElementBorders);

    // Watch for dynamic sections being added/replaced
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches && node.matches('section[id]')) {
            spyObserver.observe(node);
          }
          node.querySelectorAll('section[id]').forEach(section => {
            spyObserver.observe(section);
          });
        }
      }
    }
    
    // Automatically render new Lucide icons whenever dynamic HTML changes
    if (window.lucide && document.querySelector('i[data-lucide], [data-lucide]:not(svg)')) {
      window.lucide.createIcons();
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Initial Lucide render on DOM load
  if (window.lucide && document.querySelector('i[data-lucide], [data-lucide]:not(svg)')) {
    window.lucide.createIcons();
  }

  // Clear active links when scrolled to the very top (in the hero section)
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    }
  }, { passive: true });
});
