import { resumeData } from '../data.js';

export class PortfolioExperience extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupTabs();
  }

  render() {
    const experience = resumeData.user.experience;
    
    // Sort and filter professional and academic experiences
    const professionalItems = experience.filter(item => item.type === 'professional');
    const academicItems = experience.filter(item => item.type === 'academic');

    const renderTimeline = (items) => {
      return items.map((item, index) => {
        const periodStr = item.period.length === 1 
          ? `${item.period[0]} - Present`
          : `${item.period[0]} - ${item.period[1]}`;

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
              <p class="timeline-description">${item.description.replace(/\*/g, '<br>• ')}</p>
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
            <p class="section-subtitle">A chronological summary of my professional milestones and educational training</p>
          </div>
          
          <div class="experience-tabs">
            <button class="experience-tab-btn active" data-target="professional">
              💼 Professional Work
            </button>
            <button class="experience-tab-btn" data-target="academic">
              🎓 Academic Background
            </button>
          </div>
          
          <div class="timeline-container active" id="timeline-professional">
            <div class="timeline-line"></div>
            ${renderTimeline(professionalItems)}
          </div>
          
          <div class="timeline-container" id="timeline-academic">
            <div class="timeline-line"></div>
            ${renderTimeline(academicItems)}
          </div>
        </div>
      </section>
    `;
  }

  setupTabs() {
    const tabs = this.querySelectorAll('.experience-tab-btn');
    const professionalTimeline = this.querySelector('#timeline-professional');
    const academicTimeline = this.querySelector('#timeline-academic');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to current tab
        tab.classList.add('active');
        
        // Hide all timelines
        professionalTimeline.classList.remove('active');
        academicTimeline.classList.remove('active');
        
        // Show selected timeline
        const target = tab.getAttribute('data-target');
        if (target === 'professional') {
          professionalTimeline.classList.add('active');
        } else {
          academicTimeline.classList.add('active');
        }
      });
    });
  }
}

customElements.define('portfolio-experience', PortfolioExperience);
