import { reposData } from '../data.js';

export class PortfolioProjects extends HTMLElement {
  constructor() {
    super();
    this.projects = reposData;
    this.activeFilter = 'all';
    this.currentPage = 1;
    this.itemsPerPage = 6;
  }

  connectedCallback() {
    this.render();
    this.setupFilters();
  }

  render() {
    this.innerHTML = `
      <section class="projects-section" id="projects">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Selected Projects</h2>
            <p class="section-subtitle">A collection of open-source libraries, web components, and applications I've developed</p>
          </div>
          
          <div class="tabs-wrapper">
            <div class="project-filters">
              <button class="filter-btn ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
              <button class="filter-btn ${this.activeFilter === 'frameworks' ? 'active' : ''}" data-filter="frameworks">React &amp; Vue</button>
              <button class="filter-btn ${this.activeFilter === 'components' ? 'active' : ''}" data-filter="components">Web Components</button>
              <button class="filter-btn ${this.activeFilter === 'backend' ? 'active' : ''}" data-filter="backend">Backend &amp; Scripts</button>
            </div>
          </div>

          <div class="projects-grid" id="projects-grid">
            <!-- Projects injected dynamically -->
          </div>

          <div class="projects-pagination" id="projects-pagination">
            <!-- Pagination injected dynamically -->
          </div>
        </div>
      </section>
    `;
    this.updateProjectsDisplay();
  }

  getFilteredProjects() {
    return this.projects.filter(project => {
      if (this.activeFilter === 'all') return true;
      const lang = (project.lang || '').toLowerCase();
      const name = project.name.toLowerCase();
      const topics = (project.topics || []).map(t => t.toLowerCase());
      const hasTopic = (...keys) => topics.some(t => keys.some(k => t.includes(k)));

      if (this.activeFilter === 'frameworks') {
        return name.includes('react') || name.includes('vue') || lang === 'vue' || hasTopic('react', 'vue');
      }
      if (this.activeFilter === 'components') {
        return name.startsWith('wc-') || hasTopic('web-components');
      }
      if (this.activeFilter === 'backend') {
        return lang === 'python' || lang === 'flask' || name.includes('api') || name.includes('automation') || hasTopic('flask', 'python', 'express');
      }
      return true;
    });
  }

  getFilteredProjectsHTML(itemsToShow) {
    if (itemsToShow.length === 0) {
      return `<p class="no-projects-text">No projects found in this category.</p>`;
    }

    return itemsToShow.map(p => {
      const liveLinkBtn = p.homepage
        ? `<a href="${p.homepage}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm-card">
             Live Demo
             <i data-lucide="external-link"></i>
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
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm-card">
              Source Code
              <i data-lucide="github"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  updateProjectsDisplay() {
    const grid = this.querySelector('#projects-grid');
    const paginationContainer = this.querySelector('#projects-pagination');
    if (!grid || !paginationContainer) return;

    const filtered = this.getFilteredProjects();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    // Clamp current page
    if (this.currentPage > totalPages) {
      this.currentPage = Math.max(1, totalPages);
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    grid.innerHTML = this.getFilteredProjectsHTML(paginatedItems);
    
    if (totalPages > 1) {
      paginationContainer.style.display = 'flex';
      
      let paginationHTML = `
        <button class="btn btn-secondary btn-pagination" id="prev-page-btn" ${this.currentPage === 1 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} aria-label="Previous Page">
          <i data-lucide="chevron-left"></i>
        </button>
      `;

      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
          <button class="filter-btn btn-pagination-num ${this.currentPage === i ? 'active' : ''}" data-page="${i}" aria-label="Page ${i}">
            ${i}
          </button>
        `;
      }

      paginationHTML += `
        <button class="btn btn-secondary btn-pagination" id="next-page-btn" ${this.currentPage === totalPages ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} aria-label="Next Page">
          <i data-lucide="chevron-right"></i>
        </button>
      `;

      paginationContainer.innerHTML = paginationHTML;

      this.querySelectorAll('.btn-pagination-num').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentPage = parseInt(btn.getAttribute('data-page'));
          this.updateProjectsDisplay();
          this.scrollIntoGridTop();
        });
      });

      const prevBtn = this.querySelector('#prev-page-btn');
      if (prevBtn && this.currentPage > 1) {
        prevBtn.addEventListener('click', () => {
          this.currentPage--;
          this.updateProjectsDisplay();
          this.scrollIntoGridTop();
        });
      }

      const nextBtn = this.querySelector('#next-page-btn');
      if (nextBtn && this.currentPage < totalPages) {
        nextBtn.addEventListener('click', () => {
          this.currentPage++;
          this.updateProjectsDisplay();
          this.scrollIntoGridTop();
        });
      }
    } else {
      paginationContainer.style.display = 'none';
      paginationContainer.innerHTML = '';
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  scrollIntoGridTop() {
    const target = this.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
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
    // Scope to the filter bar — pagination numbers also carry .filter-btn
    // for styling and must not receive the filter handler
    const filters = this.querySelectorAll('.project-filters .filter-btn');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter');
        this.currentPage = 1;
        this.updateProjectsDisplay();
      });
    });
  }
}

customElements.define('portfolio-projects', PortfolioProjects);
