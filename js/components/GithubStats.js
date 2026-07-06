import { getPortfolioData } from '../api.js';

const CONTRIB_API = 'https://github-contributions-api.jogruber.de/v4/devadula-nandan?y=last';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export class GithubStats extends HTMLElement {
  constructor() {
    super();
    this.stats = null;
    this.profile = null;
    this.contributions = [];
  }

  async connectedCallback() {
    this.renderLoading();
    try {
      const [data, contribData] = await Promise.all([
        getPortfolioData(),
        fetch(CONTRIB_API).then(r => r.json()).catch(() => null)
      ]);
      this.stats = data.stats;
      this.profile = data.profile;
      this.contributions = contribData?.contributions || [];
      this.render();
    } catch (error) {
      console.error('Failed to load GitHub stats:', error);
    }
  }

  renderLoading() {
    this.innerHTML = `
      <section class="github-section" id="github">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">GitHub Activity</h2>
            <p class="section-subtitle">Contribution history and tech stack distribution</p>
          </div>
          <div class="stats-loading">Loading GitHub data...</div>
        </div>
      </section>
    `;
  }

  /**
   * Builds the contribution calendar grid HTML.
   * Returns weeks as columns, days (0=Sun..6=Sat) as rows.
   */
  buildCalendarHTML() {
    if (!this.contributions.length) return '<p class="contrib-empty">No contribution data available.</p>';

    // Group into weeks
    const weeks = [];
    let currentWeek = [];

    // Pad the start so the first day is in the correct row
    const firstDay = new Date(this.contributions[0].date).getDay(); // 0=Sun
    for (let i = 0; i < firstDay; i++) currentWeek.push(null);

    for (const contrib of this.contributions) {
      currentWeek.push(contrib);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    // Month labels — track month changes per week
    const monthLabels = weeks.map(week => {
      const firstReal = week.find(d => d !== null);
      if (!firstReal) return '';
      const d = new Date(firstReal.date);
      return d.getDate() <= 7 ? MONTHS[d.getMonth()] : '';
    });

    // Total contributions in the period
    const total = this.contributions.reduce((sum, d) => sum + d.count, 0);

    const monthRow = `
      <div class="contrib-months">
        ${monthLabels.map(m => `<div class="contrib-month-label">${m}</div>`).join('')}
      </div>
    `;

    const dayLabels = `
      <div class="contrib-day-labels">
        ${DAYS.map((d, i) => `<div class="contrib-day-label">${i % 2 !== 0 ? d : ''}</div>`).join('')}
      </div>
    `;

    const grid = `
      <div class="contrib-grid">
        ${weeks.map(week => `
          <div class="contrib-week">
            ${week.map(day => day
              ? `<div class="contrib-cell level-${day.level}" title="${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}"></div>`
              : `<div class="contrib-cell level-0 empty"></div>`
            ).join('')}
          </div>
        `).join('')}
      </div>
    `;

    const legend = `
      <div class="contrib-footer">
        <span class="contrib-total">${total.toLocaleString()} contributions in the last year</span>
        <div class="contrib-legend">
          <span class="contrib-legend-label">Less</span>
          <div class="contrib-cell level-0"></div>
          <div class="contrib-cell level-1"></div>
          <div class="contrib-cell level-2"></div>
          <div class="contrib-cell level-3"></div>
          <div class="contrib-cell level-4"></div>
          <span class="contrib-legend-label">More</span>
        </div>
      </div>
    `;

    return `${monthRow}<div class="contrib-body">${dayLabels}${grid}</div>${legend}`;
  }

  render() {
    // Top 6 languages from live API data
    const langsHTML = Object.entries(this.stats.languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang, pct]) => `
        <div class="lang-stat-item">
          <div class="lang-stat-info">
            <span class="lang-stat-name">
              <span class="lang-dot-sm" style="background:${this.getLangColor(lang)}"></span>
              ${lang}
            </span>
            <span class="lang-stat-pct">${pct}%</span>
          </div>
          <div class="lang-stat-bar-container">
            <div class="lang-stat-bar-fill" style="width:${pct}%; background:${this.getLangColor(lang)};"></div>
          </div>
        </div>
      `).join('');

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = currentTheme !== 'light';
    const streakTheme = isDark ? 'dark' : 'default';
    const accentHex = isDark ? '00f2fe' : '2563eb';
    const ringHex   = isDark ? '9d4edd' : '7c3aed';

    this.innerHTML = `
      <section class="github-section" id="github">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">GitHub Activity</h2>
            <p class="section-subtitle">Contribution history and tech stack distribution</p>
          </div>

          <!-- Contribution Calendar (the actual boxes) -->
          <div class="github-heatmap-block card">
            <div class="github-heatmap-header">
              <span class="github-heatmap-label">
                <i data-lucide="activity"></i> Contribution Calendar
              </span>
              <a href="${this.profile.githubUrl}" target="_blank" class="github-profile-link">
                View on GitHub <i data-lucide="external-link"></i>
              </a>
            </div>
            <div class="contrib-calendar-wrapper">
              ${this.buildCalendarHTML()}
            </div>
          </div>

          <!-- Bottom: Languages + Streak -->
          <div class="github-bottom-grid">
            <div class="card github-langs-card">
              <h3 class="stats-card-title">
                <i data-lucide="pie-chart"></i> Language Distribution
              </h3>
              <div class="lang-stats-list">${langsHTML}</div>
            </div>

            <div class="card github-streak-card">
              <h3 class="stats-card-title">
                <i data-lucide="flame"></i> Contribution Streak
              </h3>
              <img
                src="https://github-readme-streak-stats.herokuapp.com/?user=devadula-nandan&theme=${streakTheme}&hide_border=true&background=00000000&ring=${accentHex}&fire=${ringHex}&currStreakLabel=${accentHex}&sideLabels=${accentHex}&dates=8b949e"
                alt="GitHub Streak Stats"
                class="github-streak-img"
                data-fallback-id="streak-fallback"
              />
              <div id="streak-fallback" class="streak-fallback-list" style="display:none;">
                <div class="streak-fallback-item">
                  <span class="streak-val">${this.profile.publicReposCount}</span>
                  <span class="streak-lbl">Repos</span>
                </div>
                <div class="streak-fallback-item">
                  <span class="streak-val">${this.contributions.reduce((s,d)=>s+d.count,0).toLocaleString()}</span>
                  <span class="streak-lbl">Contributions</span>
                </div>
                <div class="streak-fallback-item">
                  <span class="streak-val">${this.profile.followers}</span>
                  <span class="streak-lbl">Followers</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    `;

    // Streak image fallback
    this.querySelectorAll('img[data-fallback-id]').forEach(img => {
      const show = () => {
        const fb = this.querySelector(`#${img.getAttribute('data-fallback-id')}`);
        if (fb) { fb.style.display = 'flex'; img.style.display = 'none'; }
      };
      if (img.complete && img.naturalWidth === 0) show();
      img.addEventListener('error', show);
    });
  }

  getLangColor(lang) {
    const map = {
      typescript: '#3178c6',
      javascript: '#f1e05a',
      python:     '#3572a5',
      vue:        '#41b883',
      html:       '#e34c26',
      css:        '#563d7c',
      scss:       '#c6538c',
      shell:      '#89e051',
      go:         '#00add8',
      rust:       '#dea584',
    };
    return map[lang.toLowerCase()] || '#8b8b8b';
  }
}

customElements.define('github-stats', GithubStats);
