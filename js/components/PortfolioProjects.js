import { getPortfolioData } from '../api.js';

export class PortfolioProjects extends HTMLElement {
  constructor() {
    super();
    this.projects = [];
    this.activeFilter = 'all';
  }

  async connectedCallback() {
    this.renderLoading();
    try {
      const data = await getPortfolioData();
      this.projects = data.projects;
      this.render();
      this.setupFilters();
    } catch (error) {
      console.error('Failed to load projects:', error);
      this.innerHTML = `<p class="error-text">Failed to load projects. Please try refreshing.</p>`;
    }
  }

  renderLoading() {
    this.innerHTML = `
      <section class="projects-section" id="projects">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Selected Projects</h2>
            <p class="section-subtitle">A collection of open-source libraries, web components, and applications I've developed</p>
          </div>
          
          <div class="project-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="frameworks">React & Vue</button>
            <button class="filter-btn" data-filter="components">Web Components</button>
            <button class="filter-btn" data-filter="backend">Backend & Scripts</button>
          </div>

          <div class="projects-grid">
            ${Array(6).fill().map(() => `
              <div class="skeleton-card card">
                <div class="skeleton-header"></div>
                <div class="skeleton-title"></div>
                <div class="skeleton-description"></div>
                <div class="skeleton-footer"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  render() {
    this.innerHTML = `
      <section class="projects-section" id="projects">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Selected Projects</h2>
            <p class="section-subtitle">A collection of open-source libraries, web components, and applications I've developed</p>
          </div>
          
          <div class="project-filters">
            <button class="filter-btn ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="filter-btn ${this.activeFilter === 'frameworks' ? 'active' : ''}" data-filter="frameworks">React & Vue</button>
            <button class="filter-btn ${this.activeFilter === 'components' ? 'active' : ''}" data-filter="components">Web Components</button>
            <button class="filter-btn ${this.activeFilter === 'backend' ? 'active' : ''}" data-filter="backend">Backend & Scripts</button>
          </div>

          <div class="projects-grid" id="projects-grid">
            ${this.getFilteredProjectsHTML()}
          </div>
        </div>
      </section>
    `;
  }

  getFilteredProjectsHTML() {
    const filtered = this.projects.filter(project => {
      if (this.activeFilter === 'all') return true;
      const lang = (project.lang || '').toLowerCase();
      const name = project.name.toLowerCase();
      
      if (this.activeFilter === 'frameworks') {
        return name.includes('react') || name.includes('vue') || lang === 'vue';
      }
      if (this.activeFilter === 'components') {
        return name.startsWith('wc-') || project.topics.includes('web-components');
      }
      if (this.activeFilter === 'backend') {
        return lang === 'python' || lang === 'flask' || name.includes('api') || name.includes('automation');
      }
      return true;
    });

    if (filtered.length === 0) {
      return `<p class="no-projects-text">No projects found in this category.</p>`;
    }

    return filtered.map(p => {
      const liveLinkBtn = p.homepage 
        ? `<a href="${p.homepage}" target="_blank" class="btn btn-primary btn-sm-card">
             Live Demo
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           </a>`
        : '';

      const topicsHTML = p.topics.slice(0, 3).map(topic => `
        <span class="project-tag-badge">${topic}</span>
      `).join('');

      return `
        <div class="project-card card animate-fade-in">
          <div class="project-card-header">
            <span class="project-lang-label" data-lang="${p.lang}">
              <span class="lang-dot" style="background-color: ${this.getLangColor(p.lang)};"></span>
              ${p.lang || 'Code'}
            </span>
            <span class="project-stars">
              <i data-lucide="star"></i> ${p.stars}
            </span>
          </div>
          <h3 class="project-card-title">${p.name.replace(/_/g, ' ')}</h3>
          <p class="project-card-desc">${p.desc}</p>
          
          <div class="project-tags-list">
            ${topicsHTML}
          </div>
          
          <div class="project-card-actions">
            ${liveLinkBtn}
            <a href="${p.url}" target="_blank" class="btn btn-secondary btn-sm-card">
              Code base
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  getLangColor(lang) {
    if (!lang) return '#7b7b7b';
    const l = lang.toLowerCase();
    if (l === 'typescript') return '#3178c6';
    if (l === 'javascript') return '#f1e05a';
    if (l === 'vue') return '#41b883';
    if (l === 'python') return '#3572A5';
    if (l === 'html') return '#e34c26';
    if (l === 'css' || l === 'scss') return '#563d7c';
    return '#8b8b8b';
  }

  setupFilters() {
    const filters = this.querySelectorAll('.filter-btn');
    const grid = this.querySelector('#projects-grid');
    
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter');
        
        // Re-render project cards inside the grid
        grid.innerHTML = this.getFilteredProjectsHTML();
      });
    });
  }
}

customElements.define('portfolio-projects', PortfolioProjects);
