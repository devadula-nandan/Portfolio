import { resumeData } from '../data.js';

const SKILL_CATEGORIES = [
  { title: 'Languages & Markup', icon: 'code', skills: ['JavaScript', 'TypeScript', 'HTML5', 'CSS / SCSS'] },
  { title: 'Frameworks & Libraries', icon: 'layers', skills: ['React.js', 'Lit', 'Redux.js', 'Web Components'] },
  { title: 'Design Systems & Styling', icon: 'palette', skills: ['Carbon Design System', 'Tailwind CSS', 'Bootstrap'] },
  { title: 'Testing & Quality', icon: 'flask-conical', skills: ['Jest', 'Cypress', 'Playwright'] },
  { title: 'Backend & Data', icon: 'database', skills: ['REST APIs', 'MySQL', 'Python'] },
];

export class PortfolioSkills extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const allSkills = Object.keys(resumeData.user.specificSkills || {});
    const used = new Set();

    // Filters categories and skills, ensuring they exist in our data schema
    const categories = SKILL_CATEGORIES
      .map(cat => {
        const skills = cat.skills.filter(s => allSkills.includes(s));
        skills.forEach(s => used.add(s));
        return { ...cat, skills };
      })
      .filter(cat => cat.skills.length);

    // Group any leftover specificSkills under a unified "Tools & Other" category
    const leftovers = allSkills.filter(s => !used.has(s));
    if (leftovers.length) {
      categories.push({ title: 'Tools & Other', icon: 'sparkles', skills: leftovers });
    }

    const categoriesHTML = categories.map(cat => `
      <div class="skill-category card">
        <h3 class="skill-category-title">
          <i data-lucide="${cat.icon}"></i>
          ${cat.title}
        </h3>
        <div class="skill-chips">
          ${cat.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="skills-section" id="skills">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Skills &amp; Toolkit</h2>
            <p class="section-subtitle">Technologies and tools I reach for to build professional, modern frontends</p>
          </div>

          <div class="skills-categories">
            ${categoriesHTML}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('portfolio-skills', PortfolioSkills);
