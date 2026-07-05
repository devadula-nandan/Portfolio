import { getPortfolioData } from '../api.js';

export class GithubStats extends HTMLElement {
  constructor() {
    super();
    this.stats = null;
    this.profile = null;
  }

  async connectedCallback() {
    this.renderLoading();
    try {
      const data = await getPortfolioData();
      this.stats = data.stats;
      this.profile = data.profile;
      this.render();
      this.setupErrorHandlers();
    } catch (error) {
      console.error('Failed to load GitHub stats:', error);
      this.innerHTML = `<p class="error-text">Failed to load GitHub stats.</p>`;
    }
  }

  renderLoading() {
    this.innerHTML = `
      <section class="github-section" id="github">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">GitHub Analytics</h2>
            <p class="section-subtitle">Live repository statistics and contributions fetched directly from my GitHub profile</p>
          </div>
          <div class="stats-loading">Loading Analytics Data...</div>
        </div>
      </section>
    `;
  }

  render() {
    // Generate language indicators
    const langsHTML = Object.entries(this.stats.languages)
      .slice(0, 5) // Top 5 languages
      .map(([lang, pct]) => `
        <div class="lang-stat-item">
          <div class="lang-stat-info">
            <span class="lang-stat-name">${lang}</span>
            <span class="lang-stat-pct">${pct}%</span>
          </div>
          <div class="lang-stat-bar-container">
            <div class="lang-stat-bar-fill" style="width: ${pct}%; background-color: ${this.getLangColor(lang)};"></div>
          </div>
        </div>
      `).join('');

    // Determine current theme for stats cards
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const statsCardTheme = currentTheme === 'light' ? 'radical' : 'monokai';

    this.innerHTML = `
      <section class="github-section" id="github">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">GitHub Analytics</h2>
            <p class="section-subtitle">Live repository statistics and contributions fetched directly from my GitHub profile</p>
          </div>
          
          <div class="github-dashboard-grid">
            <!-- Left Side: Live Stats KPIs -->
            <div class="github-kpi-block">
              <div class="kpi-grid">
                <div class="kpi-card card">
                  <span class="kpi-icon">📁</span>
                  <div class="kpi-num">${this.profile.publicReposCount}</div>
                  <div class="kpi-label">Public Repositories</div>
                </div>
                <div class="kpi-card card">
                  <span class="kpi-icon">⭐</span>
                  <div class="kpi-num">${this.stats.totalStars}</div>
                  <div class="kpi-label">Total Stars</div>
                </div>
                <div class="kpi-card card">
                  <span class="kpi-icon">🍴</span>
                  <div class="kpi-num">${this.stats.totalForks}</div>
                  <div class="kpi-label">Forks Created</div>
                </div>
                <div class="kpi-card card">
                  <span class="kpi-icon">👥</span>
                  <div class="kpi-num">${this.profile.followers}</div>
                  <div class="kpi-label">Followers</div>
                </div>
              </div>
              
              <!-- Language breakdown -->
              <div class="card lang-breakdown-card">
                <h3 class="stats-card-title">Primary Tech Stack Distribution</h3>
                <div class="lang-stats-list">
                  ${langsHTML}
                </div>
              </div>
            </div>
            
            <!-- Right Side: GitHub Readme Stats Cards with local fallbacks -->
            <div class="github-cards-block card">
              <h3 class="stats-card-title">GitHub Developer Profile</h3>
              
              <div class="github-widgets-wrapper">
                <!-- Profile Trophy Widget -->
                <div class="widget-container">
                  <img src="https://github-profile-trophy.vercel.app/?username=devadula-nandan&theme=${statsCardTheme}&no-bg=true&no-frame=true&margin-w=10" alt="Trophies" class="github-widget-img" data-fallback-id="trophies-fallback" />
                  
                  <div id="trophies-fallback" class="widget-fallback-card card" style="display: none; width: 100%;">
                    <h4 class="fallback-title">🏆 Profile Achievements</h4>
                    <div class="trophy-fallback-list">
                      <div class="trophy-fallback-item">⚡ Contributor to IBM Products</div>
                      <div class="trophy-fallback-item">⭐ Web Components Specialist</div>
                      <div class="trophy-fallback-item">📁 40 Public Repos</div>
                      <div class="trophy-fallback-item">👥 15 Followers</div>
                    </div>
                  </div>
                </div>
                
                <!-- Main Stats Card & Languages Card -->
                <div class="widgets-row">
                  <div class="widget-col">
                    <img src="https://github-readme-stats.vercel.app/api?username=devadula-nandan&show_icons=true&theme=${statsCardTheme}&bg_color=00000000&hide_title=true&hide_border=true&include_all_commits=true" alt="GitHub Stats" class="github-sub-widget" data-fallback-id="stats-fallback" />
                    
                    <div id="stats-fallback" class="widget-fallback-card card" style="display: none;">
                      <h4 class="fallback-title">📊 GitHub Activity</h4>
                      <div class="local-stats-list">
                        <div class="local-stats-row"><span>Total Stars</span> <strong>${this.stats.totalStars}</strong></div>
                        <div class="local-stats-row"><span>Followers</span> <strong>${this.profile.followers}</strong></div>
                        <div class="local-stats-row"><span>Public Repos</span> <strong>${this.profile.publicReposCount}</strong></div>
                        <div class="local-stats-row"><span>Contributions</span> <strong>150+</strong></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="widget-col">
                    <img src="https://github-readme-stats.vercel.app/api/top-langs?username=devadula-nandan&show_icons=true&layout=compact&theme=${statsCardTheme}&bg_color=00000000&hide_title=true&hide_border=true&include_all_commits=true" alt="Top Languages" class="github-sub-widget" data-fallback-id="langs-fallback" />
                    
                    <div id="langs-fallback" class="widget-fallback-card card" style="display: none;">
                      <h4 class="fallback-title">💻 Top Languages</h4>
                      <div class="local-stats-list">
                        ${Object.entries(this.stats.languages).slice(0, 4).map(([lang, pct]) => `
                          <div class="local-stats-row"><span>${lang}</span> <strong>${pct}%</strong></div>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="github-link-wrapper">
                <a href="${this.profile.githubUrl}" target="_blank" class="btn btn-primary">
                  Explore GitHub Profile
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  setupErrorHandlers() {
    const images = this.querySelectorAll('img');
    images.forEach(img => {
      // Check if image is already broken (loaded before handler registration)
      if (img.complete && img.naturalWidth === 0) {
        this.triggerFallback(img);
      }
      
      // Listen for runtime loading errors
      img.addEventListener('error', () => {
        this.triggerFallback(img);
      });
    });
  }

  triggerFallback(img) {
    const fallbackId = img.getAttribute('data-fallback-id');
    if (fallbackId) {
      const fallbackEl = this.querySelector(`#${fallbackId}`);
      if (fallbackEl) {
        fallbackEl.style.display = 'block';
        img.style.display = 'none';
      }
    }
  }

  getLangColor(lang) {
    const l = lang.toLowerCase();
    if (l === 'typescript') return '#3178c6';
    if (l === 'javascript') return '#f1e05a';
    if (l === 'vue') return '#41b883';
    if (l === 'python') return '#3572A5';
    if (l === 'html') return '#e34c26';
    if (l === 'css' || l === 'scss') return '#563d7c';
    return '#8b8b8b';
  }
}

customElements.define('github-stats', GithubStats);
