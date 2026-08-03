import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ORIGIN = 'https://www.mccsgrowingmedia.com';
const OUTPUT = path.join(ROOT, 'sitemap.xml');
const SKIP_DIRS = new Set([
  '.git',
  '.github',
  'assets',
  'data',
  'docs',
  'node_modules',
  'output',
  'reports',
  'scripts'
]);
const SKIP_FILES = new Set(['admin.html', 'privacy.html', 'terms.html']);
const CORE_PATHS = [
  '/',
  '/products/',
  '/products/conical-plugs/',
  '/sample-shipping/',
  '/private-label/',
  '/contact/',
  '/insights/',
  '/middle-east/',
  '/about/'
];

function toPosix(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function toUrlPath(relativePath) {
  if (relativePath === 'index.html') return '/';
  return `/${relativePath.replace(/\/index\.html$/, '/')}`;
}

function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function lastModified(relativePath) {
  try {
    execFileSync('git', ['diff', '--quiet', 'HEAD', '--', relativePath], { cwd: ROOT, stdio: 'ignore' });
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', relativePath], {
      cwd: ROOT,
      encoding: 'utf8'
    }).trim() || new Date().toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function findBuyerPages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) pages.push(...await findBuyerPages(fullPath));
    if (!entry.isFile() || entry.name !== 'index.html' || SKIP_FILES.has(entry.name)) continue;
    const relativePath = toPosix(fullPath);
    const html = await fs.readFile(fullPath, 'utf8');
    if (/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;
    pages.push({ relativePath, urlPath: toUrlPath(relativePath) });
  }
  return pages;
}

function sortPages(a, b) {
  const ai = CORE_PATHS.indexOf(a.urlPath);
  const bi = CORE_PATHS.indexOf(b.urlPath);
  if (ai !== -1 || bi !== -1) {
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  }
  return a.urlPath.localeCompare(b.urlPath);
}

const pages = (await findBuyerPages(ROOT)).sort(sortPages);
const rows = pages.map(({ relativePath, urlPath }) => {
  const loc = xmlEscape(`${SITE_ORIGIN}${urlPath}`);
  return `  <url><loc>${loc}</loc><lastmod>${lastModified(relativePath)}</lastmod></url>`;
});
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`;

await fs.writeFile(OUTPUT, xml, 'utf8');
console.log(`Generated sitemap.xml with ${pages.length} indexable buyer pages.`);
