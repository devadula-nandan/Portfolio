// Import and register all Web Components
import './components/PortfolioHeader.js';
import './components/PortfolioHero.js';
import './components/PortfolioAbout.js';
import './components/PortfolioSkills.js';
import './components/PortfolioExperience.js';
import './components/PortfolioProjects.js';
import './components/GithubStats.js';
import './components/McAvatar.js';
import './components/PortfolioContact.js';
import './components/PortfolioFooter.js';

// Global Console Greeting
console.log(
  '%c ⚛️ Nandan Devadula - Portfolio App Initialized %c',
  'background: #00f2fe; color: #0a0e17; padding: 4px 8px; font-weight: bold; border-radius: 4px;',
  'background: transparent; color: inherit;'
);

document.addEventListener('DOMContentLoaded', () => {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 2. Dynamic Mouse-Following Glow Effect (Only for desktop pointer devices)
  const mouseGlow = document.getElementById('mouse-glow');
  if (isFinePointer && mouseGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    const speed = 0.08; // Smooth lag factor

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseGlow.classList.add('visible');
    }, { passive: true });

    const updateGlowPosition = () => {
      glowX += (mouseX - glowX) * speed;
      glowY += (mouseY - glowY) * speed;
      // Center the glow box on the mouse cursor
      mouseGlow.style.transform = `translate3d(${glowX - 150}px, ${glowY - 150}px, 0)`;
      requestAnimationFrame(updateGlowPosition);
    };
    
    updateGlowPosition();
  }

  // 3. Active Section Scroll Spy (Intersection Observer to highlight navigation links)
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

  // Watch for dynamic elements added to the DOM to re-observe sections and render icons
  new MutationObserver((mutations) => {
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
    
    if (window.lucide && document.querySelector('i[data-lucide], [data-lucide]:not(svg)')) {
      window.lucide.createIcons();
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Initial Lucide render on load
  if (window.lucide && document.querySelector('i[data-lucide], [data-lucide]:not(svg)')) {
    window.lucide.createIcons();
  }

  // Clear active links when scrolled to the top
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    }
  }, { passive: true });
});
