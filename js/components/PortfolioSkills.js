import { resumeData } from '../data.js';

export class PortfolioSkills extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupSearch();
  }

  render() {
    const user = resumeData.user;
    
    // Convert common skills object into HTML
    const commonSkillsHTML = Object.entries(user.commonSkills).map(([skill, val]) => `
      <div class="skill-progress-item">
        <div class="skill-progress-info">
          <span class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
          <span class="skill-percent">${val}%</span>
        </div>
        <div class="skill-progress-bar-container">
          <div class="skill-progress-bar-fill" style="width: ${val}%;"></div>
        </div>
      </div>
    `).join('');

    // Convert specific skills object into HTML cards with categories
    const specificSkills = user.specificSkills;
    
    const specificSkillsHTML = Object.entries(specificSkills).map(([skill, val]) => {
      // Categorize skills for styling icons or backgrounds
      let category = 'frontend';
      const lowercaseSkill = skill.toLowerCase();
      if (['mysql', 'databases'].includes(lowercaseSkill)) {
        category = 'database';
      } else if (['python', 'express', 'flask', 'rest api'].includes(lowercaseSkill)) {
        category = 'backend';
      }

      return `
        <div class="skill-badge-card card" data-skill-name="${skill}" data-category="${category}">
          <div class="skill-badge-header">
            <span class="skill-badge-icon">${this.getSkillIcon(skill)}</span>
            <span class="skill-badge-title">${skill}</span>
          </div>
          <div class="skill-badge-level">
            <div class="skill-badge-fill" style="width: ${val}%;"></div>
          </div>
          <span class="skill-badge-percent">${val}%</span>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <section class="skills-section" id="skills">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Skills & Toolkit</h2>
            <p class="section-subtitle">A granular overview of my technical capabilities and proficiency levels</p>
          </div>
          
          <div class="skills-grid">
            <div class="skills-column core-skills card">
              <h3 class="skills-col-title">Core Competencies</h3>
              <p class="skills-col-desc">High-level distribution of engineering domains based on projects and professional workload.</p>
              <div class="skills-progress-list">
                ${commonSkillsHTML}
              </div>
            </div>
            
            <div class="skills-column specific-skills">
              <div class="skills-controls">
                <h3 class="skills-col-title">Technologies & Frameworks</h3>
                <div class="skills-search-wrapper">
                  <input type="text" id="skills-search" placeholder="Search technologies (e.g. React, Express)..." class="skills-search-input" />
                  <span class="search-icon">🔍</span>
                </div>
              </div>
              
              <div class="skills-badges-container" id="skills-container">
                ${specificSkillsHTML}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getSkillIcon(skill) {
    const s = skill.toLowerCase();
    if (s.includes('html')) return '🌐';
    if (s.includes('css')) return '🎨';
    if (s.includes('javascript') || s.includes('js')) return '🟨';
    if (s.includes('react')) return '⚛️';
    if (s.includes('redux')) return '🔄';
    if (s.includes('tailwind')) return '🌊';
    if (s.includes('bootstrap')) return '🅱️';
    if (s.includes('vue')) return '💚';
    if (s.includes('mysql') || s.includes('sql')) return '🐬';
    if (s.includes('python')) return '🐍';
    if (s.includes('express')) return '⚡';
    if (s.includes('flask')) return '🧪';
    if (s.includes('api')) return '🔌';
    return '🛠️';
  }

  setupSearch() {
    const searchInput = this.querySelector('#skills-search');
    const skillsContainer = this.querySelector('#skills-container');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = skillsContainer.querySelectorAll('.skill-badge-card');
      
      cards.forEach(card => {
        const name = card.getAttribute('data-skill-name').toLowerCase();
        if (name.includes(query)) {
          card.style.display = 'flex';
          card.classList.remove('hidden-item');
        } else {
          card.style.display = 'none';
          card.classList.add('hidden-item');
        }
      });
    });
  }
}

customElements.define('portfolio-skills', PortfolioSkills);
