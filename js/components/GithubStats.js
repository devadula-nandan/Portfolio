import { resumeData, statsData } from '../data.js';

export class GithubStats extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const stats = statsData;
    const user = resumeData.user;

    // Render languages from data.js — as chips
    const langsHTML = Object.entries(stats.languages)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => `
        <span class="skill-chip" style="display: inline-flex; align-items: center; gap: 6px;">
          <span class="lang-dot-sm" style="background:${this.getLangColor(lang)}"></span>
          ${lang}
        </span>
      `).join('');

    const heatmap = this.buildHeatmap();

    this.innerHTML = `
      <section class="github-section" id="github">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">GitHub Profile &amp; Stats</h2>
            <p class="section-subtitle">Snapshot of open-source projects, contributions, and code distribution</p>
          </div>

          <div class="github-bottom-grid animate-fade-in">
            <!-- Left Card: Metrics & Languages -->
            <div class="card github-langs-card" style="display: flex; flex-direction: column; gap: 24px;">
              <div>
                <h3 class="stats-card-title" style="margin-bottom: 20px;">
                  <i data-lucide="bar-chart-2"></i> Overview
                </h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                  <div class="stats-dashboard-item" style="border: none;">
                    <span class="stats-dashboard-val" style="font-size: 1.6rem; margin: 0;">${stats.totalRepos}</span>
                    <span class="stats-dashboard-lbl" style="font-size: 0.8rem; margin-top: 4px;">Repos</span>
                  </div>
                  <div class="stats-dashboard-item" style="border: none;">
                    <span class="stats-dashboard-val" style="font-size: 1.6rem; margin: 0;">${stats.totalStars}</span>
                    <span class="stats-dashboard-lbl" style="font-size: 0.8rem; margin-top: 4px;">Stars</span>
                  </div>
                  <div class="stats-dashboard-item" style="border: none;">
                    <span class="stats-dashboard-val" style="font-size: 1.6rem; margin: 0;">${stats.followers}</span>
                    <span class="stats-dashboard-lbl" style="font-size: 0.8rem; margin-top: 4px;">Followers</span>
                  </div>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border-color); padding-top: 24px;">
                <h3 class="stats-card-title" style="margin-bottom: 20px;">
                  <i data-lucide="pie-chart"></i> Languages
                </h3>
                <div class="skill-chips">${langsHTML}</div>
              </div>
            </div>

            <!-- Right Card: Heatmap -->
            <div class="card github-heatmap-card">
              <h3 class="stats-card-title">
                <i data-lucide="git-commit"></i> Contribution Activity
              </h3>
              <div class="heatmap-scroll">
                <div class="heatmap-grid" role="img" aria-label="GitHub-style contribution heatmap for the past year">
                  ${heatmap.cells}
                </div>
              </div>
              <div class="heatmap-meta">
                <span class="heatmap-total">${heatmap.total} contributions in the last year</span>
                <div class="heatmap-legend" aria-hidden="true">
                  <span>Less</span>
                  <span class="heatmap-cell l0"></span>
                  <span class="heatmap-cell l1"></span>
                  <span class="heatmap-cell l2"></span>
                  <span class="heatmap-cell l3"></span>
                  <span class="heatmap-cell l4"></span>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;" class="animate-fade-in">
            <a href="${user.social.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              Explore Repositories on GitHub
              <i data-lucide="github"></i>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  buildHeatmap() {
    // Seeded PRNG so the placeholder pattern is stable across reloads.
    // Swap this for real GitHub contribution data when wiring up the API.
    let seed = 20260712;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const WEEKS = 52;
    const DAYS = 7;
    let total = 0;
    let cells = '';

    for (let w = 0; w < WEEKS; w++) {
      // Slow seasonal wave so activity comes in believable bursts
      const busy = 0.55 + 0.35 * Math.sin(w / 5);
      for (let d = 0; d < DAYS; d++) {
        const weekday = d > 0 && d < 6 ? 1 : 0.45; // quieter weekends
        const r = rand() * busy * weekday;
        let level = 0;
        if (r > 0.42) level = 4;
        else if (r > 0.32) level = 3;
        else if (r > 0.22) level = 2;
        else if (r > 0.12) level = 1;
        total += level ? level + Math.floor(rand() * 3) : 0;
        cells += `<span class="heatmap-cell l${level}"></span>`;
      }
    }

    return { cells, total };
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
