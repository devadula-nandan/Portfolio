import { resumeData, reposData } from './data.js';

const GITHUB_USERNAME = 'devadula-nandan';

/**
 * Fetches dynamic data from the GitHub API with local data fallback.
 */
export async function getPortfolioData() {
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
        JavaScript: 45,
        TypeScript: 20,
        Python: 15,
        HTML: 10,
        CSS: 10
      }
    }
  };

  try {
    // 1. Fetch Profile
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

    // 2. Fetch Repos
    const reposPromise = fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
      .then(res => {
        if (!res.ok) throw new Error(`Repos fetch error: ${res.status}`);
        return res.json();
      })
      .then(repos => {
        if (!Array.isArray(repos) || repos.length === 0) return;

        // Filter out forks
        const nonForks = repos.filter(repo => !repo.fork);
        
        // Calculate statistics
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

        // Map live repos to our projects structure (ranking them by stars and updates)
        const mappedRepos = nonForks.map(repo => ({
          name: repo.name,
          desc: repo.description || 'A developer project hosted on GitHub.',
          stars: repo.stargazers_count || 0,
          lang: repo.language || 'HTML',
          homepage: repo.homepage,
          url: repo.html_url,
          topics: repo.topics || []
        }));

        // Merge with static metadata for details that are better in fallback
        const mergedProjects = [];
        
        // Add static items with updated stats if they exist in live, else add them anyway
        reposData.forEach(staticItem => {
          const liveItem = mappedRepos.find(r => r.name.toLowerCase() === staticItem.name.toLowerCase());
          if (liveItem) {
            mergedProjects.push({
              ...staticItem,
              stars: liveItem.stars || staticItem.stars,
              homepage: liveItem.homepage || staticItem.homepage,
              url: liveItem.url || staticItem.url
            });
          } else {
            mergedProjects.push(staticItem);
          }
        });

        // Add remaining live projects that are not in the static top projects
        mappedRepos.forEach(liveItem => {
          if (!mergedProjects.some(p => p.name.toLowerCase() === liveItem.name.toLowerCase())) {
            // Only add if it has description or is significant
            if (liveItem.desc && liveItem.desc !== 'my portfolio') {
              mergedProjects.push(liveItem);
            }
          }
        });

        data.projects = mergedProjects;

        // Save computed stats
        data.stats.totalStars = stars;
        data.stats.totalForks = forks;
        data.stats.totalRepos = repos.length;

        // Calculate language percentage
        const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);
        const langPercentages = {};
        for (const [lang, count] of Object.entries(langCounts)) {
          langPercentages[lang] = Math.round((count / totalLangs) * 100);
        }
        data.stats.languages = langPercentages;
      })
      .catch(err => console.warn('Could not fetch GitHub repositories, using fallback:', err));

    // Wait for requests to resolve (with a timeout so it doesn't block the site load)
    await Promise.race([
      Promise.all([profilePromise, reposPromise]),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]);
  } catch (globalError) {
    console.warn('GitHub API fetch failed globally. Running with fallback data.', globalError);
  }

  return data;
}
