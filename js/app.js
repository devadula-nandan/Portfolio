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
  // Custom pointer features (mouse glow, crosshair cursor, drag marquee) are
  // for precise pointers only — completely disabled on touch / coarse devices.
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
  if (isFinePointer && mouseGlow) {
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
  if (isFinePointer && precisionCursor && crosshairCoords) {
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
  const BLUEPRINT_SELECTOR = '.card, .project-card, .timeline-card, .widget-fallback-card, .contact-detail-card, .hero-badge, .btn, .filter-btn, .hero-image-wrapper, .nav-link, .timeline-dot';

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

  // 6. Windows-style Click-Drag Selection Marquee
  const selectionRect = document.getElementById('selection-rect');
  if (isFinePointer && selectionRect) {
    const INTERACTIVE = 'a, button, input, textarea, select, label, [contenteditable="true"]';
    const DRAG_THRESHOLD = 4; // px before the rectangle appears (so a click doesn't flash it)

    let isSelecting = false;
    let startX = 0;
    let startY = 0;

    document.addEventListener('mousedown', (e) => {
      // Left button only; leave interactive elements to their native behavior
      if (e.button !== 0 || (e.target.closest && e.target.closest(INTERACTIVE))) return;

      // Restrict drawing marquee to empty/background spaces so text selection is preserved on content
      const CONTENT_AND_CARDS = 'p, h1, h2, h3, h4, h5, h6, li, ul, ol, .card, .project-card, .timeline-card, .telemetry-card, .pillar-card, .chat-message, .skill-chip, .project-tag-badge, .timeline-tag, code, pre, i, svg, figcaption';
      if (e.target.closest && e.target.closest(CONTENT_AND_CARDS)) return;

      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;

      // Deselect any focused field and suppress the browser's default
      // text-selection / image-drag so the drag is purely a marquee
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isSelecting) return;

      const left = Math.min(e.clientX, startX);
      const top = Math.min(e.clientY, startY);
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);

      // Only reveal the rectangle once the pointer has actually dragged
      if (!selectionRect.classList.contains('active')) {
        if (width < DRAG_THRESHOLD && height < DRAG_THRESHOLD) return;
        selectionRect.classList.add('active');
      }

      selectionRect.style.left = `${left}px`;
      selectionRect.style.top = `${top}px`;
      selectionRect.style.width = `${width}px`;
      selectionRect.style.height = `${height}px`;
    }, { passive: true });

    const endSelection = () => {
      if (!isSelecting) return;
      isSelecting = false;
      selectionRect.classList.remove('active');
      selectionRect.style.width = '0px';
      selectionRect.style.height = '0px';
    };

    window.addEventListener('mouseup', endSelection);
    document.addEventListener('mouseleave', endSelection);
    window.addEventListener('blur', endSelection);
  }
});
