// Runs automatically before `npm run build` (see "prebuild" in package.json).
// Writes public/sitemap.xml and points robots.txt at it, using src/config/site.js + src/data/projects.js.
import { writeFileSync } from 'node:fs';
import { site } from '../src/config/site.js';
import { projects } from '../src/data/projects.js';

const base = site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${base}/`, priority: '1.0' },
  ...projects.map((p) => ({ loc: `${base}/projects/${p.slug}`, priority: '0.8' })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
writeFileSync(new URL('../public/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap: ${urls.length} urls`);
