// Writes public/sitemap.xml and public/robots.txt. It runs before every build (npm run build), so the list of pages
// always matches the site: it reads the page addresses from src/constants.ts, and the article and partner pages
// from src/content/blog.ts and src/content/partners.ts.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const SITE = 'https://techne.ph';

// Page addresses, such as NETWORK_BUILDOUT: 'network-buildout'. HOME is only the old home address, and PARTNERS only starts the partner pages. Neither is a page of its own.
const all = [...read('src/constants.ts').matchAll(/^\s+([A-Z_]+):\s*'([a-z0-9-]+)',?\s*$/gm)].map(([, name, id]) => ({ name, id }));
const panels = all.filter((p) => p.name !== 'HOME' && p.name !== 'PARTNERS');
const blogId = all.find((p) => p.name === 'BLOG')?.id;
const partnersId = all.find((p) => p.name === 'PARTNERS')?.id;

const slugs = (path) => [...read(path).matchAll(/^\s+slug:\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);

const urls = [
  `${SITE}/`,
  ...panels.map((p) => `${SITE}/${p.id}`),
  ...(blogId ? slugs('src/content/blog.ts').map((slug) => `${SITE}/${blogId}/${slug}`) : []),
  ...(partnersId ? slugs('src/content/partners.ts').map((slug) => `${SITE}/${partnersId}/${slug}`) : []),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(root, 'public/sitemap.xml'), xml);

writeFileSync(
  join(root, 'public/robots.txt'),
  `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`,
);

console.log(`sitemap.xml: ${urls.length} pages, robots.txt written`);
