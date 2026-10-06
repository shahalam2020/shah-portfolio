import { site } from '../config/site';
import { env } from '../config/env';

export const githubUser = env.githubUsername || site.githubUsername;
const CACHE_TTL = 30 * 60 * 1000;

const cached = async (key, loader) => {
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (hit && Date.now() - hit.t < CACHE_TTL) return hit.v;
  } catch { /* ignore */ }
  const v = await loader();
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch { /* ignore */ }
  return v;
};

const getJson = async (url) => {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GitHub request failed (${res.status})`);
  return res.json();
};

/** Public profile + repos from the GitHub REST API (no token, rate-limited per IP). */
export const getGithubOverview = () =>
  cached(`gh-overview-${githubUser}`, async () => {
    const [user, repos] = await Promise.all([
      getJson(`https://api.github.com/users/${githubUser}`),
      getJson(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`),
    ]);
    const own = repos.filter((r) => !r.fork);
    const stars = own.reduce((n, r) => n + r.stargazers_count, 0);
    const featured = [...own]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 4)
      .map((r) => ({
        name: r.name, description: r.description, url: r.html_url, language: r.language,
        stars: r.stargazers_count, forks: r.forks_count, updated: r.pushed_at,
      }));
    return {
      profile: { name: user.name, avatar: user.avatar_url, url: user.html_url, bio: user.bio, followers: user.followers, repos: user.public_repos },
      stars, featured,
    };
  });

/** Contribution calendar from a public community mirror (read-only, no auth). */
export const getContributions = () =>
  cached(`gh-contrib-${githubUser}`, async () => {
    const data = await getJson(`https://github-contributions-api.jogruber.de/v4/${githubUser}?y=last`);
    return { total: data.total?.lastYear ?? 0, days: data.contributions || [] };
  });
