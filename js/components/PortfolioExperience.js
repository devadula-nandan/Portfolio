import { resumeData } from '../data.js';

export class PortfolioExperience extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupTabs();
  }

  render() {
    const experience = resumeData.user.experience || [];
    const professionalItems = experience.filter(item => item.type === 'professional');
    const academicItems = experience.filter(item => item.type === 'academic');
    const awards = resumeData.user.awards || [];

    const renderAwardItem = (award, index) => `
      <div class="timeline-item award-item animate-fade-in" style="animation-delay: ${index * 0.05}s;">
        <div class="timeline-dot"></div>
        <div class="timeline-card card award-card">
          <div class="timeline-header">
            <span class="timeline-period">${award.year}</span>
            <span class="timeline-place-tag">${award.place}</span>
          </div>
          <h4 class="award-title">${award.title}</h4>
          <p class="timeline-desc-lead">${award.description}</p>
        </div>
      </div>
    `;

    const renderExpItem = (item, index) => {
        const startDate = this.formatDate(item.period[0]);
        const endDate = item.period.length > 1 ? this.formatDate(item.period[1]) : 'Present';
        const periodStr = `${startDate} — ${endDate}`;

        const tagsHTML = item.tags && item.tags.length
          ? `<div class="timeline-tags">
              ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
             </div>`
          : '';

        const metaHTML = item.location
          ? `<span class="timeline-meta">
              <i data-lucide="map-pin"></i> ${item.location}
              ${item.workType ? `<span class="timeline-worktype">${item.workType}</span>` : ''}
             </span>`
          : '';

        const descHTML = item.description
          .split('*')
          .map(part => part.trim())
          .filter(Boolean)
          .map((part, idx) => idx === 0
            ? `<p class="timeline-desc-lead">${part}</p>`
            : `<div class="timeline-desc-bullet"><i data-lucide="chevron-right"></i><span>${part}</span></div>`
          )
          .join('');

        return `
          <div class="timeline-item animate-fade-in" style="animation-delay: ${index * 0.05}s;">
            <div class="timeline-dot"></div>
            <div class="timeline-card card">
              <div class="timeline-header">
                <span class="timeline-period">${periodStr}</span>
                <span class="timeline-place-tag">${item.place}</span>
              </div>
              <h3 class="timeline-role">${item.title}</h3>
              ${metaHTML}
              <div class="timeline-description">${descHTML}</div>
              ${tagsHTML}
            </div>
          </div>
        `;
    };

    const renderTimeline = (items) => {
      if (items.length === 0) {
        return `<p class="timeline-empty">No records found.</p>`;
      }
      return items.map(renderExpItem).join('');
    };

    // Merge professional experience and awards into one chronological flow
    // (newest first). Awards only carry a year, so pin them to mid-year —
    // that slots an award between the start dates of the roles around it.
    const merged = [
      ...professionalItems.map(item => ({ date: new Date(item.period[0]), kind: 'exp', item })),
      ...awards.map(award => ({ date: new Date(`${award.year}-07-01`), kind: 'award', item: award })),
    ].sort((a, b) => b.date - a.date);

    const mergedHTML = merged.length
      ? merged.map((entry, i) => entry.kind === 'exp'
          ? renderExpItem(entry.item, i)
          : renderAwardItem(entry.item, i)
        ).join('')
      : `<p class="timeline-empty">No records found.</p>`;

    this.innerHTML = `
      <section class="experience-section" id="experience">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Experience &amp; Journey</h2>
            <p class="section-subtitle">Chronological summary of my professional milestones and education</p>
          </div>
          
          <div class="tabs-wrapper">
            <div class="experience-tabs" role="tablist" aria-label="Work history sectors">
              <button class="experience-tab-btn active" id="tab-professional" role="tab" aria-selected="true" aria-controls="timeline-professional" data-target="professional">
                <i data-lucide="briefcase"></i> Professional Work
              </button>
              <button class="experience-tab-btn" id="tab-academic" role="tab" aria-selected="false" aria-controls="timeline-academic" data-target="academic" tabindex="-1">
                <i data-lucide="graduation-cap"></i> Academic Background
              </button>
            </div>
            <button class="awards-toggle-btn" id="awards-toggle" aria-pressed="false" title="Show or hide recognition timeline">
              <i data-lucide="award"></i> Recognition
            </button>
          </div>
          
          <div class="timeline-merged awards-hidden" id="timeline-dual">
            <div class="timeline-container has-awards active" id="timeline-professional" role="tabpanel" aria-labelledby="tab-professional" aria-hidden="false">
              <div class="timeline-line"></div>
              <div class="timeline-line timeline-line-right"></div>
              ${mergedHTML}
            </div>

            <div class="timeline-container" id="timeline-academic" role="tabpanel" aria-labelledby="tab-academic" aria-hidden="true">
              <div class="timeline-line"></div>
              ${renderTimeline(academicItems)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  formatDate(dateStr) {
    if (!dateStr || dateStr === 'Present') return 'Present';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  setupTabs() {
    const tabs = this.querySelectorAll('.experience-tab-btn');
    const professionalTimeline = this.querySelector('#timeline-professional');
    const academicTimeline = this.querySelector('#timeline-academic');

    const awardsToggle = this.querySelector('#awards-toggle');
    const dual = this.querySelector('#timeline-dual');
    if (awardsToggle && dual) {
      awardsToggle.addEventListener('click', () => {
        const show = !awardsToggle.classList.contains('active');
        awardsToggle.classList.toggle('active', show);
        awardsToggle.setAttribute('aria-pressed', String(show));
        dual.classList.toggle('awards-hidden', !show);
      });
    }

    if (!professionalTimeline || !academicTimeline) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.removeAttribute('tabindex');

        const target = tab.getAttribute('data-target');
        if (target === 'professional') {
          professionalTimeline.classList.add('active');
          professionalTimeline.setAttribute('aria-hidden', 'false');
          academicTimeline.classList.remove('active');
          academicTimeline.setAttribute('aria-hidden', 'true');
        } else {
          academicTimeline.classList.add('active');
          academicTimeline.setAttribute('aria-hidden', 'false');
          professionalTimeline.classList.remove('active');
          professionalTimeline.setAttribute('aria-hidden', 'true');
        }

        if (window.lucide) {
          window.lucide.createIcons();
        }
      });

      tab.addEventListener('keydown', (e) => {
        let nextTab = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextTab = tab.nextElementSibling || tabs[0];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextTab = tab.previousElementSibling || tabs[tabs.length - 1];
        }
        if (nextTab && nextTab.classList.contains('experience-tab-btn')) {
          nextTab.focus();
          nextTab.click();
          e.preventDefault();
        }
      });
    });
  }
}

customElements.define('portfolio-experience', PortfolioExperience);
