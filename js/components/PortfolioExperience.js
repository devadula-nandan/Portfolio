import { resumeData } from '../data.js';

export class PortfolioExperience extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupTabs();
  }

  render() {
    const experience = resumeData.user.experience;

    const professionalItems = experience.filter(item => item.type === 'professional');
    const academicItems = experience.filter(item => item.type === 'academic');

    const renderTimeline = (items) => {
      return items.map((item, index) => {
        // Format period display
        const startDate = this.formatDate(item.period[0]);
        const endDate = item.period.length > 1 ? this.formatDate(item.period[1]) : 'Present';
        const periodStr = `${startDate} — ${endDate}`;

        // Render skill tags if present
        const tagsHTML = item.tags && item.tags.length
          ? `<div class="timeline-tags">
              ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
            </div>`
          : '';

        // Render location/workType badge if present
        const metaHTML = item.location
          ? `<span class="timeline-meta">
              <i data-lucide="map-pin"></i> ${item.location}
              ${item.workType ? `<span class="timeline-worktype">${item.workType}</span>` : ''}
            </span>`
          : '';

        // Convert * bullet markers to styled bullets
        const descHTML = item.description
          .split('*')
          .map((part, i) => part.trim())
          .filter(Boolean)
          .map((part, i) => i === 0
            ? `<p class="timeline-desc-lead">${part}</p>`
            : `<div class="timeline-desc-bullet"><i data-lucide="chevron-right"></i><span>${part}</span></div>`
          )
          .join('');

        return `
          <div class="timeline-item animate-fade-in" style="animation-delay: ${index * 0.1}s;">
            <div class="timeline-dot-wrapper">
              <div class="timeline-dot"></div>
              <div class="timeline-connector"></div>
            </div>
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
      }).join('');
    };

    this.innerHTML = `
      <section class="experience-section" id="experience">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Experience & Journey</h2>
            <p class="section-subtitle">A chronological summary of my professional milestones and educational background</p>
          </div>
          
          <div class="experience-tabs" role="tablist" aria-label="Experience journey sections">
            <button class="experience-tab-btn active" id="tab-professional" role="tab" aria-selected="true" aria-controls="timeline-professional" data-target="professional">
              <i data-lucide="briefcase"></i> Professional Work
            </button>
            <button class="experience-tab-btn" id="tab-academic" role="tab" aria-selected="false" aria-controls="timeline-academic" data-target="academic" tabindex="-1">
              <i data-lucide="graduation-cap"></i> Academic Background
            </button>
          </div>
          
          <div class="timeline-container active" id="timeline-professional" role="tabpanel" aria-labelledby="tab-professional" aria-hidden="false">
            <div class="timeline-line"></div>
            ${renderTimeline(professionalItems)}
          </div>
          
          <div class="timeline-container" id="timeline-academic" role="tabpanel" aria-labelledby="tab-academic" aria-hidden="true">
            <div class="timeline-line"></div>
            ${renderTimeline(academicItems)}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Formats a date string "M/D/YYYY" → "Month YYYY"
   * "Present" is returned as-is.
   */
  formatDate(dateStr) {
    if (!dateStr || dateStr === 'Present') return 'Present';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  setupTabs() {
    const tabs = this.querySelectorAll('.experience-tab-btn');
    const professionalTimeline = this.querySelector('#timeline-professional');
    const academicTimeline = this.querySelector('#timeline-academic');

    tabs.forEach(tab => {
      // Mouse Click Interaction
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.removeAttribute('tabindex');

        professionalTimeline.classList.remove('active');
        professionalTimeline.setAttribute('aria-hidden', 'true');
        academicTimeline.classList.remove('active');
        academicTimeline.setAttribute('aria-hidden', 'true');

        const target = tab.getAttribute('data-target');
        if (target === 'professional') {
          professionalTimeline.classList.add('active');
          professionalTimeline.setAttribute('aria-hidden', 'false');
        } else {
          academicTimeline.classList.add('active');
          academicTimeline.setAttribute('aria-hidden', 'false');
        }
      });

      // Keyboard Arrow Key Navigation
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
