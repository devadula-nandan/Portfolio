import { resumeData } from '../data.js';

/**
 * Skills grouped into meaningful categories and shown as simple tags.
 * No proficiency percentages — self-assigned skill percentages are subjective
 * and read as filler; categorized tags are the clearer, professional convention.
 *
 * Skill names must match the keys in resumeData.user.specificSkills. Any skill
 * present in the data but not listed here is collected into a "More" group, so
 * nothing is silently dropped if the data changes.
 */
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

    // Keep only skills that actually exist in the data
    const categories = SKILL_CATEGORIES
      .map(cat => {
        const skills = cat.skills.filter(s => allSkills.includes(s));
        skills.forEach(s => used.add(s));
        return { ...cat, skills };
      })
      .filter(cat => cat.skills.length);

    // Surface any data skills we didn't explicitly categorize
    const leftovers = allSkills.filter(s => !used.has(s));
    if (leftovers.length) {
      categories.push({ title: 'More', icon: 'sparkles', skills: leftovers });
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
            <p class="section-subtitle">The technologies and tools I reach for to build accessible, enterprise-grade interfaces</p>
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
