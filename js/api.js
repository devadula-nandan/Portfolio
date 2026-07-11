import { resumeData, reposData } from './data.js';

const GITHUB_USERNAME = 'devadula-nandan';
const README_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/main/README.md`;

/**
 * Parses the portfolio JSON blob embedded in the GitHub profile README.
 * Format in README: <!-- '{ ...json... }' -->
 */
function parseReadmeData(readmeText) {
  try {
    const match = readmeText.match(/<!--\s*'(\{[\s\S]*?\})'\s*-->/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch (e) {
    console.warn('Could not parse README JSON, using fallback data.', e);
  }
  return null;
}

/**
 * Fetches dynamic data from the GitHub profile README and GitHub API.
 * Falls back to local data.js if any fetch fails.
 *
 * Schema v2: supports headline, highlights[], experience[].tags, experience[].location
 *
 * The result is memoized so multiple components share a single set of
 * network requests instead of each re-fetching the GitHub API.
 */
let portfolioDataPromise = null;

export function getPortfolioData() {
  if (portfolioDataPromise) {
    return portfolioDataPromise;
  }

  const CACHE_KEY = 'nandan_portfolio_cache_v2';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.timestamp && parsed.data && (Date.now() - parsed.timestamp < CACHE_TTL)) {
        console.log(
          '%c ⚡ GitHub Portfolio data loaded from local cache %c',
          'background: #00f2fe; color: #0a0e17; padding: 2px 6px; font-weight: bold; border-radius: 4px;',
          'background: transparent; color: inherit;'
        );
        portfolioDataPromise = Promise.resolve(parsed.data);
        return portfolioDataPromise;
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage cache:', e);
  }

  portfolioDataPromise = loadPortfolioData().then(data => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (e) {
      console.warn('Error writing to localStorage cache:', e);
    }
    return data;
  });

  return portfolioDataPromise;
}

async function loadPortfolioData() {
  // Start with local fallback data
  const data = {
    profile: {
      ...resumeData.user,
      githubUrl: `https://github.com/${GITHUB_USERNAME}`,
      followers: 15,
      publicReposCount: 40,
    },
    projects: [...reposData],
    stats: {
      totalStars: 10,
      totalForks: 4,
      totalRepos: 40,
      languages: {
        JavaScript: 35,
        TypeScript: 30,
        Python: 15,
        HTML: 12,
        CSS: 8
      }
    }
  };

  try {
    // 1. Fetch GitHub Profile README (source of truth for personal data)
    const readmePromise = fetch(README_URL)
      .then(res => {
        if (!res.ok) throw new Error(`README fetch error: ${res.status}`);
        return res.text();
      })
      .then(readmeText => {
        const parsed = parseReadmeData(readmeText);
        if (parsed && parsed.user) {
          // Merge README data over fallback, keeping github runtime fields
          const { githubUrl, followers, publicReposCount } = data.profile;
          data.profile = {
            ...data.profile,
            ...parsed.user,
            githubUrl,
            followers,
            publicReposCount,
          };
        }
      })
      .catch(err => console.warn('Could not fetch GitHub README, using fallback data:', err));

    // 2. Fetch live GitHub Profile stats (followers, repo count, avatar)
    const profilePromise = fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then(res => {
        if (!res.ok) throw new Error(`Profile fetch error: ${res.status}`);
        return res.json();
      })
      .then(githubProfile => {
        data.profile.followers = githubProfile.followers;
        data.profile.publicReposCount = githubProfile.public_repos;
        data.profile.avatar = githubProfile.avatar_url;
        data.profile.company = githubProfile.company || data.profile.company;
      })
      .catch(err => console.warn('Could not fetch GitHub profile, using fallback:', err));

    // 3. Fetch live Repos (stars, forks, languages, projects list)
    const reposPromise = fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    )
      .then(res => {
        if (!res.ok) throw new Error(`Repos fetch error: ${res.status}`);
        return res.json();
      })
      .then(repos => {
        if (!Array.isArray(repos) || repos.length === 0) return;

        // Exclude forks from stats
        const nonForks = repos.filter(repo => !repo.fork);

        let stars = 0;
        let forks = 0;
        const langCounts = {};

        nonForks.forEach(repo => {
          stars += repo.stargazers_count || 0;
          forks += repo.forks_count || 0;
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });

        // Map live repos to project cards
        const mappedRepos = nonForks.map(repo => ({
          name: repo.name,
          desc: repo.description || 'A developer project hosted on GitHub.',
          stars: repo.stargazers_count || 0,
          lang: repo.language || 'HTML',
          homepage: repo.homepage,
          url: repo.html_url,
          topics: repo.topics || []
        }));

        // Keep the section curated: show only the hand-picked list from
        // data.js, enriched with live star counts and links. Auto-appending
        // every public repo buried the highlighted work under practice repos.
        const mergedProjects = reposData.map(staticItem => {
          const liveItem = mappedRepos.find(
            r => r.name.toLowerCase() === staticItem.name.toLowerCase()
          );
          return liveItem
            ? { ...staticItem, stars: liveItem.stars, homepage: liveItem.homepage || staticItem.homepage, url: liveItem.url }
            : staticItem;
        });

        data.projects = mergedProjects;
        data.stats.totalStars = stars;
        data.stats.totalForks = forks;
        data.stats.totalRepos = repos.length;

        // Language percentages (by repo count)
        const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
        if (totalLangs > 0) {
          const langPct = {};
          for (const [lang, count] of Object.entries(langCounts)) {
            langPct[lang] = Math.round((count / totalLangs) * 100);
          }
          data.stats.languages = langPct;
        }
      })
      .catch(err => console.warn('Could not fetch GitHub repositories, using fallback:', err));

    // Wait for all fetches (with a 5s timeout so it never blocks render)
    await Promise.race([
      Promise.all([readmePromise, profilePromise, reposPromise]),
      new Promise(resolve => setTimeout(resolve, 5000))
    ]);

  } catch (globalError) {
    console.warn('GitHub API fetch failed globally. Running with fallback data.', globalError);
  }

  return data;
}
